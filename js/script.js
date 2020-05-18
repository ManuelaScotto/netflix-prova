$(document).ready(function() {
    var url = 'https://api.themoviedb.org/3';
    var api_key = 'fc85ade35eb700240ef3f0585fe03d64';
    $.ajax ({
        url: url + '/movie/popular',
        method: 'GET',
        data: {
            'api_key': api_key,
            'language': 'it-IT'
        },
        success: function (data) {
            console.log(data.results);
           printFilm(data.results, 'filmPop', 'film');
        },
        error: function (richesta, stato, errori) {
            console.log('errore ' + errori);          
        }
    })  
    $.ajax ({
        url: url + '/tv/popular',
        method: 'GET',
        data: {
            'api_key': api_key,
            'language': 'it-IT'
        },
        success: function (data) {
           printFilm(data.results, 'seriePop', 'serie');
        },
        error: function (richesta, stato, errori) {
            console.log('errore ' + errori);          
        }
    })  
    $('.parent-dropdown').mouseenter(function() {
        $(this).children('.dropdown').addClass('active');
    });
    $('.parent-dropdown').mouseleave(function() {
        $(this).children('.dropdown').removeClass('active');
    });
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
    
    })
    // $('.button-search').click(function(){
    //     var thisTitle = $('input').val();
    //     console.log(thisTitle);
    //     callAjax(thisTitle);   
    //     callAjaxTv(thisTitle);
    //     clean();    
    // });
    // $('input').keydown(function() {
    //     if(event.keyCode == 13 || event.wich == 13) {
    //         var thisTitle = $('input').val();
    //         callAjax(thisTitle); 
    //         callAjaxTv(thisTitle);   
    //         clean(); 
    //     }
    // });
    $(document).on('keyup', 'input', function() {
        var thisTitle = $(this).val();
        callAjax(url, api_key, thisTitle); 
        callAjaxTv(url, api_key, thisTitle);   
        clean(); 
        if(event.keyCode == 13 || event.wich == 13) {
            var thisTitle = $('input').val();
            callAjax(thisTitle); 
            callAjaxTv(thisTitle);   
            clean();
            $('input').val(''); 
        }
    });
    
    
}); //fine document.ready
//--------------------FUNCTION-----------------------

//call film
function callAjax (url, api_key, val){
    $.ajax ({
        url: url + '/search/movie',
        method: 'GET',
        data: {
            'api_key': api_key,
            'query': val,
            'language': 'it-IT'
        },
        success: function (data) {
            $('.text-film').removeClass('active');  
            if (data.total_results < 1 ) {
                $('.text-film').text('Non ci sono risultati per i film cercati').addClass('active');
             } else if (data.total_results > 0){
                    printFilm(data.results, 'film', 'film'); 
                    $('.text-film').text('Film').addClass('active');    
                }
        },
        error: function (richesta, stato, errori) {
            console.log('errore ' + errori);          
        }
    })  
}

//call serie TV
function callAjaxTv (url, api_key, val){
    $.ajax ({
        url: url + '/search/tv',
        method: 'GET',
        data: {
            'api_key': api_key,
            'query': val,
            'language': 'it-IT'
        },
        success: function (data) {
            $('.text-serie').removeClass('active');
            if (data.total_results < 1 ) {
                $('.text-serie').text('Non ci sono risultati per le serie cercate').addClass('active');
             } else if (data.total_results > 0){
                    printFilm(data.results, 'serie', 'serie'); 
                    $('.text-serie').text('Serie Tv').addClass('active');  
                    
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
            image =  '<img src="img/unnamed.png" alt=""></img>';
        } else {
            image = '<img src="' + urlBaseImage + film.poster_path + '" alt=""></img>'
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
    // $('input').val('');
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