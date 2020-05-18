$(document).ready(function() {
    var url = 'https://api.themoviedb.org/3/movie/popular';
    var api_key = 'fc85ade35eb700240ef3f0585fe03d64';
    $.ajax ({
        url: url,
        method: 'GET',
        data: {
            'api_key': api_key,
            'language': 'it-IT'
        },
        success: function (data) {
            console.log(data.results);
           printFilmPop(data.results)
        },
        error: function (richesta, stato, errori) {
            console.log('errore ' + errori);          
        }
    })  
    var url = 'https://api.themoviedb.org/3/tv/popular';
    var api_key = 'fc85ade35eb700240ef3f0585fe03d64';
    $.ajax ({
        url: url,
        method: 'GET',
        data: {
            'api_key': api_key,
            'language': 'it-IT'
        },
        success: function (data) {
           printSeriesPop(data.results);
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
        callAjax(thisTitle); 
        callAjaxTv(thisTitle);   
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
function callAjax (val){
    var url = 'https://api.themoviedb.org/3/search/movie';
    var api_key = 'fc85ade35eb700240ef3f0585fe03d64';
    $.ajax ({
        url: url,
        method: 'GET',
        data: {
            'api_key': api_key,
            'query': val,
            'language': 'it-IT'
        },
        success: function (data) {
            // console.log(data.results);
            if( data.total_results > 0 ) {
                printFilm(data.results);                
            } else {
                printNoResult();
            }
        },
        error: function (richesta, stato, errori) {
            console.log('errore ' + errori);          
        }
    })  
}

//call serie TV
function callAjaxTv (val){
    var url = 'https://api.themoviedb.org/3/search/tv';
    var api_key = 'fc85ade35eb700240ef3f0585fe03d64';
    $.ajax ({
        url: url,
        method: 'GET',
        data: {
            'api_key': api_key,
            'query': val,
            'language': 'it-IT'
        },
        success: function (data) {
            // console.log(data.results);
            if( data.total_results > 0 ) {
                printSeries(data.results);                
            } else {
                printNoResult();
            }
        },
        error: function (richesta, stato, errori) {
            console.log('errore ' + errori); 
        }
    })  
}

function printFilm(array) {
    for (var i= 0; i < array.length; i++) {
        var source = $("#entry-template").html();
        var template = Handlebars.compile(source);    
        var film = array[i];
        var vote =  Math.ceil(film.vote_average)/2;
        // console.log(film.title);     
        var context = { 
            title: film.title,
            img: film.poster_path,
            original_title: film.original_title,
            lang: printFlag (film.original_language),
            vote_average: vote,
            star: printStar (vote)
         };
        var html = template(context);
        $('#film').append(html);        
    }
}

function printFilmPop(array) {
    for (var i= 0; i < array.length; i++) {
        var source = $("#entry-template").html();
        var template = Handlebars.compile(source);    
        var film = array[i];
        var vote =  Math.ceil(film.vote_average)/2;
        // console.log(film.title);     
        var context = { 
            title: film.title,
            img: film.poster_path,
            original_title: film.original_title,
            lang: printFlag (film.original_language),
            vote_average: vote,
            star: printStar (vote)
         };
        var html = template(context);
        $('#film-popular').append(html);        
    }
}

function printSeries(array) {
    for (var i= 0; i < array.length; i++) {
        var source = $("#entry-template").html();
        var template = Handlebars.compile(source);    
        var serie = array[i];
        var vote =  Math.ceil(serie.vote_average)/2;    
        var context = { 
            title: serie.name,
            img: serie.poster_path,
            original_title: serie.original_name,
            lang: printFlag (serie.original_language),
            vote_average: vote,
            star: printStar (vote)
         };
        var html = template(context);
        $('#serie').append(html);        
    }
}
function printSeriesPop(array) {
    for (var i= 0; i < array.length; i++) {
        var source = $("#entry-template").html();
        var template = Handlebars.compile(source);    
        var serie = array[i];
        var vote =  Math.ceil(serie.vote_average)/2;    
        var context = { 
            title: serie.name,
            img: serie.poster_path,
            original_title: serie.original_name,
            lang: printFlag (serie.original_language),
            vote_average: vote,
            star: printStar (vote)
         };
        var html = template(context);
        $('#serie-popular').append(html);        
    }
}

function printNoResult() {
    var source = $("#no-result-template").html();
    var template = Handlebars.compile(source);
    var html = template();
    $('#film').append(html); 
}
function clean () {
    // $('input').val('');
    $('#film').text('');
    $('#serie').text('');
}
function printStar (vote) {
    var star = '';
    for (var i = 1; i <= 5; i++) {
        if( i <= vote ) {
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
            var flag = 'img/flag_' + language + '.png';
        }
    } return flag;
}