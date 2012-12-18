$(function(){

  var images = [];
  URLResult = function(url, text) {
    this.url = url;

    this.shouldBeInserted = function(){
      if( url.match(/\.(gif|jpg)$/i) && (images.indexOf(url) == -1)){
        images.push(url);
        return true;
      } else {
        return false;
      }
    };

    this.output = function(){
      if ( this.shouldBeInserted() ){
        $('#images').append(
          $('<div class="result"/>').html(text).append(
            $('<img>').attr('src', url)
          )
        );
      };
    };
  }

  function getStuff(){
    query_array = [$('#query').val()];
    image_array = [];
    if($('#gif').is(':checked')){
      image_array.push('*.gif');
    }
    if($('#jpg').is(':checked')){
      image_array.push('*.jpg');
    }
    query_array.push(image_array.join(' OR '));
    if($('#killbieber').is(':checked')){
      query_array.push('-1d* -1d -"one direction" -onedirection* -bieber* -belieber* -justin -justinbieber -niall* -harry*');
    }

    query = query_array.join(' ');
    console.log(query);
    $.ajax({
      url: 'http://search.twitter.com/search.json',
      dataType: 'jsonp',
      beforeSend: function(){
        $('.working').show();
      },
      complete: function(){
        $('.working').hide();
      },
      data: {
        'q': query,
        'rpp': 100,
        'include_entities': 'true',
        'lang': 'en',
        'result_type': 'recent'
      },
      success: function(data){
        console.log(data);
        if(data.error){
          $('images').insert('error');
          return;
        }
        images = [];
        $('#images').html('');
        $(data.results).each(function(index,element){
          $(element.entities).each(function(index,entities){
            $(entities.urls).each(function(index,url){
              var result = new URLResult(url.expanded_url, element.text);
              result.output();
            });
          });
        });
      }
    });
  }

  $('form').submit(
    function(e){
      e.preventDefault();
      getStuff();
    }
   );
  $('input[type="checkbox"]').click(
    function(e){
      getStuff();
    }
  );

});
