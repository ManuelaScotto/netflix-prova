$(document).ready(function() { 
    //SEARCH ANIMATE
    var click = false;
    $('.icon-search').click(function() {
        if (click == false) {
            $('.search').css('border-color', 'white');
            $('::placeholder').css('color', 'white');
            $('.search').animate({
                width: '220px',
                height: '40px'
            },500);
            $('#search').css('display', 'flex')
            click = true;
        } else {
            $('.search').animate({
                height: '0px',
                width: '0px',
            },500);
           setTimeout(function() {
               $('.search').css('border-color', 'black');
           }, 500);       
            $('#search').css('display', 'none');
            click = false;
        }   
    });

    //VARIABILI
    var url = 'https://api.themoviedb.org/3';
    var urlFilmPop = url + '/movie/popular';
    var urlSeriePop = url + '/tv/popular';
    var api_key = 'fc85ade35eb700240ef3f0585fe03d64';
    var urlFilm = url + '/search/movie';
    var urlSerie = url + '/search/tv';

    // FILM POPOLARI
    callFilmPop (urlFilmPop, api_key, 'filmPop');
    callFilmPop (urlSeriePop, api_key, 'seriePop');

    //SEARCH FILM
    $(document).on('keyup', 'input', function() {       
    var thisTitle = $(this).val();
    callMovie(urlFilm, api_key, thisTitle, film );
    callMovie(urlSerie, api_key, thisTitle, serie );   
    clean(); 
    if(event.keyCode == 13 || event.wich == 13) {
        var thisTitle = $('input').val();
        callMovie(urlFilm, api_key, thisTitle, film );
        callMovie(urlSerie, api_key, thisTitle, serie );  
        clean();
        $('input').val(''); 
    } else if (event.keyCode == 8 || event.wich == 8 && thisTitle.lenght < 0) {
        $('.text-serie').removeClass('active');
        $('.text-film').removeClass('active');
    }
    });

    //DROPDOWN
    $('.parent-dropdown').mouseenter(function() {
        $(this).children('.dropdown').addClass('active');
    });
    $('.parent-dropdown').mouseleave(function() {
        $(this).children('.dropdown').removeClass('active');
    });
}); //fine document.ready


//--------------------FUNCTION-----------------------

function callFilmPop (url, api_key, append) {
    $.ajax ({
        url: url,
        method: 'GET',
        data: {
            'api_key': api_key,
            'language': 'it-IT'
        },
        success: function (data) {
            if (append == 'filmPop') {
                printFilm(data.results, 'filmPop', 'film');
            } else {
                printFilm(data.results, 'seriePop', 'serie');
            }
        },
        error: function (richesta, stato, errori) {
            console.log('errore ' + errori);          
        }
    })  
} 

function callMovie (url, api_key, val, text) {
    $.ajax ({
        url: url ,
        method: 'GET',
        data: {
            'api_key': api_key,
            'query': val,
            'language': 'it-IT'
        },
        success: function (data) {
            if (text == film) {
                $('.text-film').removeClass('active');  
                if (data.total_results < 1 ) {
                    $('.text-film').text('Non ci sono risultati per i film cercati').addClass('active');
                 } else if (data.total_results > 0){
                        printFilm(data.results, 'film', 'film'); 
                        $('.text-film').text('Film').addClass('active');    
                    }
            } else if (text == serie) {
                $('.text-serie').removeClass('active');
                if (data.total_results < 1 ) {
                    $('.text-serie').text('Non ci sono risultati per le serie cercate').addClass('active');
                 } else if (data.total_results > 0){
                        printFilm(data.results, 'serie', 'serie'); 
                        $('.text-serie').text('Serie Tv').addClass('active');                         
                }
            }
        },
        error: function (richesta, stato, errori) {
            console.log('errore ' + errori);          
        }
    })  
}

function printFilm(array, append, type) {
    for (var i= 0; i < array.length; i++) {
        var source = $("#entry-template").html();
        var template = Handlebars.compile(source);    
        var film = array[i];
        var vote =  Math.ceil(film.vote_average)/2;
        var title;
        var original_title; 
        if (type == 'film' && append == 'film') {
            title = film.title;
            original_title= film.original_title;
            append = $('#film');
        } else if (type == 'film' && append == 'filmPop') {
            append = $('#film-popular'); 
        
        } else if (type == 'serie' && append == 'serie') {
            title = film.name;
            original_title= film.original_name;
            append = $('#serie');
            console.log(title + 'serie');
        } else if (type == 'serie' && append == 'seriePop') {
            append = $('#serie-popular'); 
        } ;

        var image;
        var urlBaseImage = 'https://image.tmdb.org/t/p/w185';
        if(film.poster_path == null) {
            image =  '<img src="img/unnamed.png" alt="'+ title + '"></img>';
        } else {
            image = '<img src="' + urlBaseImage + film.poster_path + '" alt="'+ title + '"></img>';
        }
        var context = { 
            title: title,
            img: image,
            original_title: original_title,
            lang: printFlag (film.original_language),
            vote_average: vote,
            star: printStar (vote)
         };

        var html = template(context);     
        append.append(html);       
    }
}

function clean () {
    $('#film').text('');
    $('#serie').text('');
}
function printStar (num) {
    var star = '';
    for (var i = 1; i <= 5; i++) {
        if( i <= num ) {
            star += ' <i class="fas fa-star"></i>'; 
        }  else {
            star = star  + '<i class="far fa-star"></i>';
        }
     } 
    return star;   
}

function printFlag (language) {
    var flags = ['de', 'en', 'es', 'fr', 'it', 'ja', 'ru'];
    for (var i = 0; i < flags.length; i++) {
        if (language == flags[i]) {
            var flag = '<img class="flag" src="img/flag_' + language + '.png " alt="">';
        }
    } return flag;
    // stesso metodo con .includes
    if(flags.includes(language)) {
        var flag = 'img/flag_' + language + '.png';
    }
    return flag;
}