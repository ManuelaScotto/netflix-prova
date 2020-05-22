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

    // CLICK INFO 
    $(document).on('click', '.button-info', function(){ 
        var thisInfo = $(this).parent().parent().parent().prev('.container-info-big');
        $(this).parent().parent().parent().prev('.container-info-big').addClass('active');
        var id = thisInfo.attr('data-id');
       
        
    //    var genre = thisInfo.attr('data-genre'); 
        var urlCast = 'https://api.themoviedb.org/3/movie/' + id + '/credits';
        // var urlGenre = 'https://api.themoviedb.org/3/genre/movie/list'
        var urlGenreFilm = url + '/movie/' + id;
        var urlGenreSerie = url + '/tv/' + id;
        $.ajax({
        url: urlCast,
        method: 'GET',
        data: {
            'api_key': api_key,
            'language': 'it-IT'
        },
        success: function (data) {
            var risultatoCast = data.cast;
            var dataid = data.id;   
                 
            if (dataid == id) {
                for (var i= 0; i < 5; i++) {
                    var source = $("#cast-template").html();
                    var template = Handlebars.compile(source);   
                    var cast = risultatoCast[i];              
                    castName = cast.name;                    
                    var context = {
                        namecast: castName,
                        // genre: film.genres,
                    }

                var html = template(context);
                
                thisInfo.find(".cast").append(html);
              }
            }
        },
            error: function (richesta, stato, errori) {
                console.log('errore ' + errori);
            }
    }) ;
        $.ajax({
            url: url + '/movie/' + id,
            method: 'GET',
            data: {
                'api_key': api_key,
                'language': 'it-IT'
            },
            success: function (data) {
                var genres = data.genres;
                for (var key of genres) {
                    var source = $("#cast-template").html();
                    var template = Handlebars.compile(source);
                    var context = { 
                        genre: key.name,
                    }

                    var html = template(context);

                    thisInfo.find(".genre").append(html);
                    console.log(key.name);                   
                }
                
            },
            error: function (richesta, stato, errori) {
                console.log('errore ' + errori);
            }
        });
    
    });
    $(document).on('click', '.close', function () {
        $(this).parent().removeClass('active');
       
    });
    
    // FILM POPOLARI
    callFilmPop (urlFilmPop, api_key, 'filmPop');
    callFilmPop (urlSeriePop, api_key, 'seriePop');
    // callCast (urlCastFilm, api_key, 'filmPop' );
    //SEARCH FILM
    $(document).on('keyup', 'input', function() {       
    var thisTitle = $(this).val();
    callMovie(urlFilm, api_key, thisTitle, film );
    callMovie(urlSerie, api_key, thisTitle, serie ); 
    // callCast (urlCast, api_key);  
    clean(); 
    if(event.keyCode == 13 || event.wich == 13) {
        var thisTitle = $('input').val();
        callMovie(urlFilm, api_key, thisTitle, film );
        callMovie(urlSerie, api_key, thisTitle, serie );  
        // callCast (urlCast, api_key);  
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


function scrollMessage() {
    var heightContainer = $('.main.active').height();
    console.log(heightContainer);//per controllare l'altezza del container in base al contenuto
    $('.wrapper-main').scrollTop(heightContainer); //gli stiamo dicendo di andare a scrollare dove è indicato con l'height
}
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
                printFilm(data.results, 'filmPop', 'film', api_key);
           
            } else {
                printFilm(data.results, 'seriePop', 'serie', api_key);
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
                        printFilm(data.results, 'film', 'film', api_key); 
                        $('.text-film').text('Film').addClass('active');    
                    }
            } else if (text == serie) {
                $('.text-serie').removeClass('active');
                if (data.total_results < 1 ) {
                    $('.text-serie').text('Non ci sono risultati per le serie cercate').addClass('active');
                 } else if (data.total_results > 0){
                        printFilm(data.results, 'serie', 'serie',url, api_key); 
                        $('.text-serie').text('Serie Tv').addClass('active');                         
                }
            }
        },
        error: function (richesta, stato, errori) {
            console.log('errore ' + errori);          
        }
    })  
}

function printFilm(array, append, type ) {
    for (var i= 0; i < array.length; i++) {
        var source = $("#entry-template").html();
        var template = Handlebars.compile(source);    
        var film = array[i];
        var vote =  Math.ceil(film.vote_average)/2;
        var title;
        var original_title; 
        var num = i;
        // console.log(id);
      
        if (type == 'film') {
            title = film.title;
            original_title= film.original_title;
        } else if (type == 'serie') {
            title = film.name;
            original_title= film.original_name;
        };

        if (append == 'film') {
            append = $('#film');
        } else if (append == 'filmPop') {
            append = $('#film-popular'); 
        } else if (append == 'serie') {
            append = $('#serie');
        } else if (append == 'seriePop') {
            append = $('#serie-popular'); 
        };

        var image;
        var urlBaseImage = 'https://image.tmdb.org/t/p/w185';
        if(film.poster_path == null) {
            image =  '<img src="img/unnamed.png" alt="'+ title + '"></img>';
        } else {
            image = '<img src="' + urlBaseImage + film.poster_path + '" alt="'+ title + '"></img>';
        }
        
        var imgBig;
        var urlBaseImageBig = 'https://image.tmdb.org/t/p/w342';
        if (film.poster_path == null) {
            imgBig = '<img src="img/unnamed.png" alt="' + title + '"></img>';
        } else {
            imgBig = '<img src="' + urlBaseImageBig + film.poster_path + '" alt="' + title + '"></img>';
        }

        var context = { 
            title: title,
            img: image,
            imgBig: imgBig,
            original_title: original_title,
            lang: printFlag (film.original_language),
            overview: film.overview,
            vote_average: vote,
            star: printStar (vote),
            id: film.id,
            num
         };          
        
         
        var html = template(context);     
        append.append(html); 
        //  if (num <= 10) {
        //      console.log(num);
        //      $('.container-card').removeClass('none');
        //      $('.container-card').removeClass('second_group'); 
        //     $('.container-card').addClass('first_group');
        // }
    }
}

// function callCast (url, api_key, id, thisInfo) {
//     $.ajax ({
//         url: url,
//         method: 'GET',
//         data: {
//             'api_key': api_key,
//             'language': 'it-IT'
//         },
//         success: function (data) {
//             var risultatoCast = data.cast;
//             var dataid = data.id;
//             if (dataid == id) {
//                 for (var i= 0; i < 5; i++) {
//                     var cast = risultatoCast[i];              
//                     castName = cast.name;
//                     var source = $("#cast-template").html();
//                     var template = Handlebars.compile(source);    
//                     var context = {
//                         cast: castName
//                     }
//             //   var source = $(".cast").html();
//             //   var template = Handlebars.compile(source);
    
//             //   for (var e = 0; e < risultatoCast.length; e++) {
//             //     var castSingolo = risultatoCast[e];
    
//             //     var context = {
//             //       cast: castSingolo.name,
//             //     };
//                 var html = template(context);
//                 thisInfo.find(".container-info-big-text").append(html);
//                 console.log(castName);
                
//               }
//             }
    
         
//             // console.log(cast);
//             // printCast (cast);

//         },
//         error: function (richesta, stato, errori) {
//             console.log('errore ' + errori);          
//         }

//     })
// }

function printCast (array) {
    var castName = '';
    for (var i= 0; i < 5; i++) {
        var cast = array[i];              
        castName = cast.name;
        console.log(castName);
        var source = $("#cast-template").html();
        var template = Handlebars.compile(source);    
        var context = {
            cast: castName
        }
        var html = template(context);     
        $('.cast').append(html); 
        // if (append == 'film') {
        //     append = $('#film');
        // } else if (append == 'filmPop') {
        //     append = $('#film-popular'); 
        // } else if (append == 'serie') {
        //     append = $('#serie');
        // } else if (append == 'seriePop') {
        //     append = $('#serie-popular'); 
        // }
        }// return castName;

}
function clean () {
    $('#film').text('');
    $('#serie').text('');
}
function printStar (num) {
    var star = '';
    for (var i = 1; i <= 5; i++) {
        if( i <= num ) {
            star += '<i class="fas fa-star"></i>'; 
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

