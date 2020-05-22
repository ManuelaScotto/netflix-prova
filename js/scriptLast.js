$(document).ready(function () {
    /////SEARCH ANIMATE
    var click = false;
    $('.icon-search').click(function () {
        if (click == false) {
            $('.search').css('border-color', 'white');
            $('::placeholder').css('color', 'white');
            $('.search').animate({
                width: '220px',
                height: '40px'
            }, 500);
            $('#search').css('display', 'flex')
            click = true;
        } else {
            $('.search').animate({
                height: '0px',
                width: '0px',
            }, 500);
            setTimeout(function () {
                $('.search').css('border-color', 'black');
            }, 500);
            $('#search').css('display', 'none');
            click = false;
        }
    });

    /////VARIABILI
    var url = 'https://api.themoviedb.org/3';
    var api_key = 'fc85ade35eb700240ef3f0585fe03d64';
    var urlFilm = url + '/search/movie';
    var urlSerie = url + '/search/tv';
    var urlTrendAll = url + '/trending/all/week';

    ///// CLICK INFO 
    $(document).on('click', '.button-info', function () {
        var thisInfo = $(this).parent().parent().parent().prev('.container-info-big');
        $(this).parent().parent().parent().prev('.container-info-big').addClass('active');
        var id = thisInfo.attr('data-id');
        var urlCast = 'https://api.themoviedb.org/3/movie/' + id + '/casts';

        //CALL AND PRINT CAST
        $.ajax({
            url: urlCast,
            method: 'GET',
            data: {
                'api_key': api_key,
                'language': 'it-IT'
            },
            success: function (data) {
                var risultatoCast = data.cast;
               
                console.log(risultatoCast);
                
                var actors = [];
                for (const actor of risultatoCast) {               
                    if (actor.order < 5) {
                        actors.push(actor);
                    
                        
                    }
                }
                console.log(actors);
                
                var source = $("#cast-template").html();
                var template = Handlebars.compile(source);
                var context = {
                    namecast: actors,
                }
                var html = template(context);
                thisInfo.find(".cast").append(html);
                // var dataid = data.id;
                // if (dataid == id) {
                //     for (var i = 0; i < 5; i++) {
                        // var source = $("#cast-template").html();
                        // var template = Handlebars.compile(source);
                        // var cast = risultatoCast[i];
                        // castName = cast.name;
                        // var context = {
                        //     namecast: castName,
                        // }
                        // var html = template(context);
                        // thisInfo.find(".cast").append(html);
                    // }
                // }
            },
            error: function (richesta, stato, errori) {
                console.log('errore ' + errori);
            }
        });

        //CALL AND PRINT GENRE
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

    ///// CALL AND PRINT TRENDING FILM AND SERIES
    callFilm(urlTrendAll, api_key, 'trendingAll');

    ////SEARCH FILM E SERIE
    $(document).on('keyup', 'input', function () {
        var thisTitle = $(this).val();
        callMovie(urlFilm, api_key, thisTitle, film);
        callMovie(urlSerie, api_key, thisTitle, serie);
        clean();
        if (event.keyCode == 13 || event.wich == 13) {
            var thisTitle = $('input').val();
            callMovie(urlFilm, api_key, thisTitle, film);
            callMovie(urlSerie, api_key, thisTitle, serie);
            clean();
            $('input').val('');
        } else if (event.keyCode == 8 || event.wich == 8 && thisTitle.lenght < 0) {
            $('.text-serie').removeClass('active');
            $('.text-film').removeClass('active');
            $('.container-film-pop').show();
        }
    });

    //DROPDOWN
    $('.parent-dropdown').mouseenter(function () {
        $(this).children('.dropdown').addClass('active');
    });
    $('.parent-dropdown').mouseleave(function () {
        $(this).children('.dropdown').removeClass('active');
    });

}); //fine document.ready


//--------------------FUNCTION-----------------------

/////////CALL FILM AND SERIES TRENDING
function callFilm(url, api_key) {
    $.ajax({
        url: url,
        method: 'GET',
        data: {
            'api_key': api_key,
            'language': 'it-IT'
        },
        success: function (data) {
            printFilm(data.results, 'trendingAll');
        },
        error: function (richesta, stato, errori) {
            console.log('errore ' + errori);
        }
    })
}

////////CALL FILM AND SERIES FROM INPUT
function callMovie(url, api_key, val, text) {
    $.ajax({
        url: url,
        method: 'GET',
        data: {
            'api_key': api_key,
            'query': val,
            'language': 'it-IT'
        },
        success: function (data) {
            if (text == film) {
                $('.text-film').removeClass('active');
                if (data.total_results < 1) {
                    $('.text-film').text('Non ci sono risultati per i film cercati').addClass('active');
                } else if (data.total_results > 0) {
                    printFilm(data.results, 'film', 'film', api_key);
                    $('.text-film').text('Film').addClass('active');
                }
            } else if (text == serie) {
                $('.text-serie').removeClass('active');
                if (data.total_results < 1) {
                    $('.text-serie').text('Non ci sono risultati per le serie cercate').addClass('active');
                } else if (data.total_results > 0) {
                    printFilm(data.results, 'serie', 'serie', url, api_key);
                    $('.text-serie').text('Serie Tv').addClass('active');
                }
            }
        },
        error: function (richesta, stato, errori) {
            console.log('errore ' + errori);
        }
    })
}

///////PRINT TRENDING FILM AND SERIES AND FROM SEARCH
function printFilm(array, append, type) {
    for (var i = 0; i < array.length; i++) {
        var source = $("#entry-template").html();
        var template = Handlebars.compile(source);
        var film = array[i];
        var vote = Math.ceil(film.vote_average) / 2;
        var title;
        var original_title;
        var num = i;

        if (type == 'film') {
            title = film.title;
            original_title = film.original_title;
        } else if (type == 'serie') {
            title = film.name;
            original_title = film.original_name;
        };

        if (append == 'film') {
            append = $('#film');
        } else if (append == 'serie') {
            append = $('#serie');
        } else if (append == 'trendingAll') {
            append = $("#trending-all")
        };

        var image;
        var urlBaseImage = 'https://image.tmdb.org/t/p/w185';
        if (film.poster_path == null) {
            image = '<img src="img/unnamed.png" alt="' + title + '"></img>';
        } else {
            image = '<img src="' + urlBaseImage + film.poster_path + '" alt="' + title + '"></img>';
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
            lang: printFlag(film.original_language),
            overview: film.overview,
            vote_average: vote,
            star: printStar(vote),
            id: film.id,
            num
        };


        var html = template(context);
        append.append(html);
    }
}


/////CLEAN HTML BEFORE AND AFTER SEARCH 
function clean() {
    $('#film').text('');
    $('#serie').text('');
    $('.container-film-pop').hide();
}

/////PRINT STAR IN HOVER CONTAINER-CARD
function printStar(num) {
    var star = '';
    for (var i = 1; i <= 5; i++) {
        if (i <= num) {
            star += '<i class="fas fa-star"></i>';
        } else {
            star = star + '<i class="far fa-star"></i>';
        }
    }
    return star;
}

/////PRINT FLAG IN HOVER CONTAINER-CARD
function printFlag(language) {
    var flags = ['de', 'en', 'es', 'fr', 'it', 'ja', 'ru'];
    for (var i = 0; i < flags.length; i++) {
        if (language == flags[i]) {
            var flag = '<img class="flag" src="img/flag_' + language + '.png " alt="">';
        }
    } return flag;
}

