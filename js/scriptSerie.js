$(document).ready(function () {
    /////VARIABILI
    var url = 'https://api.themoviedb.org/3';
    var api_key = 'fc85ade35eb700240ef3f0585fe03d64';
    var urlSerie = url + '/search/tv';
    var urlTrendingSerie = url + '/trending/tv/day';

    ///// CALL AND PRINT POPULAR SERIES
    callFilm(urlTrendingSerie, api_key);

    ////SEARCH SERIES
    $(document).on('keyup', 'input', function () {
        var thisTitle = $(this).val();
        callMovie(urlSerie, api_key, thisTitle);
        clean();

        if (event.keyCode == 13 || event.wich == 13) {
            var thisTitle = $('input').val();
            callMovie(urlSerie, api_key, thisTitle);
            clean();
            $('input').val('');
        } else if (event.keyCode == 8 || event.wich == 8 && thisTitle.lenght < 0) {
            $('.text-serie').removeClass('active');
            $('.container-serie-pop').show();
        }
    });

    /////SEARCH BY GENRE 
    $.ajax({
        url: url + '/genre/movie/list',
        method: 'GET',
        data: {
            'api_key': api_key,
            'language': 'it-IT'
        },
        success: function (data) {
            var genre = data.genres;
            var source = $("#genre-template").html();
            var template = Handlebars.compile(source);
            for (var i = 0; i < genre.length; i++) {
                var context = {
                    genreId: genre[i].id,
                    genreName: genre[i].name
                }
                var html = template(context);
                $("select").append(html)
            }
        },
        error: function (richesta, stato, errori) {
            console.log('errore ' + errori);
        }
    });
    $("select").change(function () {
        var genre = $("select").val();
        console.log(genre);
        searchByGenre(genre);
    });  

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

    ///// CLICK INFO 
    $(document).on('click', '.button-info', function () {
        var thisInfo = $(this).parent().parent().parent().prev('.container-info-big');
        $(this).parent().parent().parent().prev('.container-info-big').addClass('active');
        var id = thisInfo.attr('data-id');
        var urlCast = 'https://api.themoviedb.org/3/movie/' + id + '/credits';

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
                var dataid = data.id;
                if (dataid == id) {
                    for (var i = 0; i < 5; i++) {
                        var source = $("#cast-template").html();
                        var template = Handlebars.compile(source);
                        var cast = risultatoCast[i];
                        castName = cast.name;
                        var context = {
                            namecast: castName,
                        }
                        var html = template(context);
                        thisInfo.find(".cast").append(html);
                    }
                }
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

    //DROPDOWN
    $('.parent-dropdown').mouseenter(function () {
        $(this).children('.dropdown').addClass('active');
    });
    $('.parent-dropdown').mouseleave(function () {
        $(this).children('.dropdown').removeClass('active');
    });

}); //fine document.ready

//--------------------FUNCTION-----------------------

/////////CALL SERIES TRENDING TODAY
function callFilm(url, api_key) {
    $.ajax({
        url: url,
        method: 'GET',
        data: {
            'api_key': api_key,
            'language': 'it-IT'
        },
        success: function (data) {
                printFilm(data.results, 'serieDay')
        },
        error: function (richesta, stato, errori) {
            console.log('errore ' + errori);
        }
    })
}

////////CALL SERIES FROM INPUT
function callMovie(url, api_key, val) {
    $.ajax({
        url: url,
        method: 'GET',
        data: {
            'api_key': api_key,
            'query': val,
            'language': 'it-IT'
        },
        success: function (data) {
                $('.text-serie').removeClass('active');
                if (data.total_results < 1) {
                    $('.text-serie').text('Non ci sono risultati per le serie cercate').addClass('active');
                } else if (data.total_results > 0) {
                    printFilm(data.results, 'serie', 'serie', url, api_key);
                    $('.text-serie').text('Serie Tv').addClass('active');
                }
        },
        error: function (richesta, stato, errori) {
            console.log('errore ' + errori);
        }
    })
}

///////PRINT POPULAR SERIES AND FROM INPUT
function printFilm(array, append, type) {
    for (var i = 0; i < array.length; i++) {
        var source = $("#entry-template").html();
        var template = Handlebars.compile(source);
        var film = array[i];
        var vote = Math.ceil(film.vote_average) / 2;
        var num = i;

        if (append == 'serie') {
            append = $('#serie');
        } else if (append == 'serieDay') {
            append = $('#serie-trending');
        };

        var image;
        var urlBaseImage = 'https://image.tmdb.org/t/p/w185';
        if (film.poster_path == null) {
            image = '<img src="img/unnamed.png" alt="' + film.title + '"></img>';
        } else {
            image = '<img src="' + urlBaseImage + film.poster_path + '" alt="' + film.title + '"></img>';
        }

        var imgBig;
        var urlBaseImageBig = 'https://image.tmdb.org/t/p/w342';
        if (film.poster_path == null) {
            imgBig = '<img src="img/unnamed.png" alt="' + film.title + '"></img>';
        } else {
            imgBig = '<img src="' + urlBaseImageBig + film.poster_path + '" alt="' + film.title + '"></img>';
        }

        var context = {
            title: film.title,
            img: image,
            imgBig: imgBig,
            original_title: film.original_title,
            lang: printFlag(film.original_language),
            overview: film.overview,
            vote_average: vote,
            star: printStar(vote),
            id: film.id,
            genreId: film.genre_ids,
            num
        };

        var html = template(context);
        append.append(html);
    }
}

///////FILTER BY GENRE
function searchByGenre(val) {
    $(".container-card").each(function () {
        var thisGenre = $(this).attr('data-genre');

        if (!thisGenre.includes(val)) {
            $(this).hide();
        } else {
            $(this).show();
        }
    })
};

/////CLEAN HTML BEFORE AND AFTER SEARCH 
function clean() {
    $('#film').text('');
    $('#serie').text('');
    $('.container-serie-pop').hide();
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

