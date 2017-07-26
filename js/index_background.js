(function() {

    var width, height, largeHeader, canvas, ctx, points, target, animateHeader = true;

    // Main
    initHeader();
    initAnimation();
    addListeners();

    function initHeader() {
        width = window.innerWidth;
        height = window.innerHeight;
        target = {x: width/2, y: height/2};

        largeHeader = document.getElementById('large-header');
        largeHeader.style.height = height+'px';

        canvas = document.getElementById('demo-canvas');
        canvas.width = width;
        canvas.height = height;
        ctx = canvas.getContext('2d');

        // create points
        points = [];
        for(var x = 0; x < width; x = x + width/20) {
            for(var y = 0; y < height; y = y + height/20) {
                var px = x + Math.random()*width/20;
                var py = y + Math.random()*height/20;
                var p = {x: px, originX: px, y: py, originY: py };
                points.push(p);
            }
        }

        // for each point find the 5 closest points
        for(var i = 0; i < points.length; i++) {
            var closest = [];
            var p1 = points[i];
            for(var j = 0; j < points.length; j++) {
                var p2 = points[j]
                if(!(p1 == p2)) {
                    var placed = false;
                    for(var k = 0; k < 5; k++) {
                        if(!placed) {
                            if(closest[k] == undefined) {
                                closest[k] = p2;
                                placed = true;
                            }
                        }
                    }

                    for(var k = 0; k < 5; k++) {
                        if(!placed) {
                            if(getDistance(p1, p2) < getDistance(p1, closest[k])) {
                                closest[k] = p2;
                                placed = true;
                            }
                        }
                    }
                }
            }
            p1.closest = closest;
        }

        // assign a circle to each point
        for(var i in points) {
            var c = new Circle(points[i], 2+Math.random()*2, 'rgba(255,255,255,0.3)');
            points[i].circle = c;
        }
    }

    // Event handling
    function addListeners() {
        if(!('ontouchstart' in window)) {
            window.addEventListener('mousemove', mouseMove);
        }
        window.addEventListener('scroll', scrollCheck);
        window.addEventListener('resize', resize);
    }

    function mouseMove(e) {
        var posx = posy = 0;
        if (e.pageX || e.pageY) {
            posx = e.pageX;
            posy = e.pageY;
        }
        else if (e.clientX || e.clientY)    {
            posx = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
            posy = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
        }
        target.x = posx;
        target.y = posy;
    }

    function scrollCheck() {
        if(document.body.scrollTop > height) animateHeader = false;
        else animateHeader = true;
    }

    function resize() {
        width = window.innerWidth;
        height = window.innerHeight;
        largeHeader.style.height = height+'px';
        canvas.width = width;
        canvas.height = height;
    }

    // animation
    function initAnimation() {
        animate();
        for(var i in points) {
            shiftPoint(points[i]);
        }
    }

    function animate() {
        if(animateHeader) {
            ctx.clearRect(0,0,width,height);
            for(var i in points) {
                // detect points in range
                if(Math.abs(getDistance(target, points[i])) < 4000) {
                    points[i].active = 0.3;
                    points[i].circle.active = 0.6;
                } else if(Math.abs(getDistance(target, points[i])) < 20000) {
                    points[i].active = 0.1;
                    points[i].circle.active = 0.3;
                } else if(Math.abs(getDistance(target, points[i])) < 40000) {
                    points[i].active = 0.02;
                    points[i].circle.active = 0.1;
                } else {
                    points[i].active = 0;
                    points[i].circle.active = 0;
                }

                drawLines(points[i]);
                points[i].circle.draw();
            }
        }
        requestAnimationFrame(animate);
    }

    function shiftPoint(p) {
        TweenLite.to(p, 1+1*Math.random(), {x:p.originX-50+Math.random()*100,
            y: p.originY-50+Math.random()*100, ease:Circ.easeInOut,
            onComplete: function() {
                shiftPoint(p);
            }});
    }

    // Canvas manipulation
    function drawLines(p) {
        if(!p.active) return;
        for(var i in p.closest) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p.closest[i].x, p.closest[i].y);
            ctx.strokeStyle = 'rgba(156,217,249,'+ p.active+')';
            ctx.stroke();
        }
    }

    function Circle(pos,rad,color) {
        var _this = this;

        // constructor
        (function() {
            _this.pos = pos || null;
            _this.radius = rad || null;
            _this.color = color || null;
        })();

        this.draw = function() {
            if(!_this.active) return;
            ctx.beginPath();
            ctx.arc(_this.pos.x, _this.pos.y, _this.radius, 0, 2 * Math.PI, false);
            ctx.fillStyle = 'rgba(156,217,249,'+ _this.active+')';
            ctx.fill();
        };
    }

    // Util
    function getDistance(p1, p2) {
        return Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2);
    }
    
(function($) {
  $.fn.SocialCounter = function(options) {
    var settings = $.extend({
      // These are the defaults.
      twitter_user:'',
      facebook_user:'',
      facebook_token:'',
      instagram_user:'',
      instagram_user_sandbox:'',
      instagram_token:'',
      google_plus_id:'',
      google_plus_key:'',
      linkedin_oauth:'',
      youtube_user:'',
      youtube_user_square:'',
      youtube_key:'',
      vine_user:'',
      pinterest_user:'',
      dribbble_user:'',
      dribbble_token:'',
      soundcloud_user_id:'',
      soundcloud_client_id:'',
      vimeo_user:'',
      vimeo_token:'',
      github_user:'',
      behance_user:'',
      behance_client_id:'',
      vk_id:'',
      foursquare_user:'',
      foursquare_token:'',
      tumblr_username:'',
      twitch_username:'',
      twitch_client_id:'',
      spotify_artist_id:'',
      spotify_user_id:''
    }, options);

    function pinterest(){
      //Pinterst API V3
      $.ajax({
        url: 'https://api.pinterest.com/v3/pidgets/users/'+settings.pinterest_user+'/pins',
        dataType: 'jsonp',
        type: 'GET',
        success: function(data) {   
          var followers = parseInt(data.data.user.follower_count);
          var k = kFormatter(followers);
          $('#wrapper .item.pinterest .count').append(k); 
          $('#wrapper .item.pinterest').attr('href','https://pinterest.com/'+settings.pinterest_user);
          getTotal(followers); 
        } 
      }); 
    }
    function dribbble(){
      //Dribble API
      $.ajax({
        url: 'https://api.dribbble.com/v1/users/'+settings.dribbble_user,
        dataType: 'json',
        type: 'GET',
        data:{
          access_token: settings.dribbble_token
        },
        success: function(data) {   
          var followers = parseInt(data.followers_count);
          var k = kFormatter(followers);
          $('#wrapper .item.dribbble .count').append(k); 
          $('#wrapper .item.dribbble').attr('href','https://dribbble.com/'+settings.dribbble_user);
          getTotal(followers); 
        } 
      }); 
    }
    function facebook(){
      //Facebook API
      //60 Day Access Token - Regenerate a new one after two months
      //https://neosmart-stream.de/facebook/how-to-create-a-facebook-access-token/
      //https://smashballoon.com/custom-facebook-feed/access-token/
      $.ajax({
        url: 'https://graph.facebook.com/v2.8/'+settings.facebook_user,
        dataType: 'json',
        type: 'GET',
        data: {
          access_token:settings.facebook_token,
          fields:'fan_count'
        },
        success: function(data) {   
          var followers = parseInt(data.fan_count);
          var k = kFormatter(followers);
          $('#wrapper .item.facebook .count').append(k); 
          $('#wrapper .item.facebook').attr('href','https://facebook.com/'+settings.facebook_user);
          getTotal(followers); 
        } 
      }); 
    }
    function instagram(){
      $.ajax({
        url: 'https://api.instagram.com/v1/users/self/',
        dataType: 'jsonp',
        type: 'GET',
        data: {
          access_token: settings.instagram_token
        },
        success: function(data) {
          var followers = parseInt(data.data.counts.followed_by);
          var k = kFormatter(followers);
          $('#wrapper .item.instagram .count').append(k);
          $('#wrapper .item.instagram').attr('href','https://instagram.com/'+settings.instagram_user);
          getTotal(followers); 
        }
      });
    }
    function instagram_sandbox(){
       $.ajax({
         url: 'https://api.instagram.com/v1/users/search?q='+settings.instagram_user_sandbox,
         dataType: 'jsonp',
         type: 'GET',
         data: {
           access_token: settings.instagram_token
         },
         success: function(data) {
           $.each(data.data, function(i, item) {
             if(settings.instagram_user_sandbox == item.username){
               $.ajax({
                 url: "https://api.instagram.com/v1/users/" + item.id,
                 dataType: 'jsonp',          
                 type: 'GET',
                 data: {
                   access_token: settings.instagram_token
                 },
                 success: function(data) {
                   var followers = parseInt(data.data.counts.followed_by);
                   var k = kFormatter(followers);
                   $('#wrapper .instagram_sandbox .count').append(k);
                   $('#wrapper .item.instagram_sandbox').attr('href','https://instagram.com/'+settings.instagram_user_sandbox);
                   getTotal(followers); 
                 }
               });
             } 
           });
         }
       });
     }
    function google(){
      //Google+ API
      $.ajax({
        url: 'https://www.googleapis.com/plus/v1/people/' + settings.google_plus_id,
        type: "GET",
        dataType: "json",
        data:{
          key:settings.google_plus_key
        },
        success: function (data) {
          var followers = parseInt(data.circledByCount);
          var k = kFormatter(followers);
          $("#wrapper .item.google .count").append(k);
          $('#wrapper .item.google').attr('href','https://plus.google.com/'+settings.google_plus_id);
          getTotal(followers); 
        }
      });
    }
    function youtube(){
      $.ajax({
        url: 'https://www.googleapis.com/youtube/v3/channels',
        dataType: 'jsonp',
        type: 'GET',
        data:{
          part:'statistics',
          forUsername:settings.youtube_user,
          key: settings.youtube_key
        },
        success: function(data) {   
          var subscribers = parseInt(data.items[0].statistics.subscriberCount);
          var k = kFormatter(subscribers);
          $('#wrapper .item.youtube .count').append(k); 
          $('#wrapper .item.youtube').attr('href','https://youtube.com/'+settings.youtube_user);
          getTotal(subscribers); 
        } 
      }); 
    }
    function youtubeSquare(){
      $.ajax({
        url: 'https://www.googleapis.com/youtube/v3/channels',
        dataType: 'jsonp',
        type: 'GET',
        data:{
          part:'statistics',
          forUsername:settings.youtube_user_square,
          key: settings.youtube_key
        },
        success: function(data) {   
          var subscribers = parseInt(data.items[0].statistics.subscriberCount);
          var k = kFormatter(subscribers);
          $('#wrapper .item.youtube_square .count').append(k); 
          $('#wrapper .item.youtube_square').attr('href','https://youtube.com/'+settings.youtube_user_square);
          getTotal(subscribers); 
        } 
      }); 
    }
    function soundcloud(){
      //SoundCloud API
      $.ajax({
        url: 'http://api.soundcloud.com/users/'+settings.soundcloud_user_id,
        dataType: 'json',
        type: 'GET',
        data:{
          client_id: settings.soundcloud_client_id
        },
        success: function(data) {   
          var followers = parseInt(data.followers_count);
          var k = kFormatter(followers);
          $('#wrapper .item.soundcloud .count').append(k); 
          $('#wrapper .item.soundcloud').attr('href',data.permalink_url);
          getTotal(followers); 
        } 
      }); 
    }
    function vimeo(){
      //Vimeo V3 API
      $.ajax({
        url: 'https://api.vimeo.com/users/'+settings.vimeo_user+'/followers',
        dataType: 'json',
        type: 'GET',
        data:{
          access_token: settings.vimeo_token
        },
        success: function(data) {   
          var followers = parseInt(data.total);
          $('#wrapper .item.vimeo .count').append(followers).digits(); 
          $('#wrapper .item.vimeo').attr('href','https://vimeo.com/'+settings.vimeo_user);
          getTotal(followers); 
        } 
      }); 
    }
    function twitter(){
      $.ajax({
        url: '../SocialCounters/twitter/index.php',
        dataType: 'json',
        type: 'GET',
        data:{
          user:settings.twitter_user
        },
        success: function(data) {   
          var followers = parseInt(data.followers);
          $('#wrapper .item.twitter .count').append(followers).digits(); 
          $('#wrapper .item.twitter').attr('href','https://twitter.com/'+settings.twitter_user);
          getTotal(followers); 
        } 
      }); 
    }
    function github(){
      //Github
      $.ajax({
        url: 'https://api.github.com/users/'+settings.github_user,
        dataType: 'json',
        type: 'GET',
        success: function(data) {   
          var followers = parseInt(data.followers);
          var k = kFormatter(followers);
          $('#wrapper .item.github .count').append(k); 
          $('#wrapper .item.github').attr('href','https://github.com/'+settings.github_user);
          getTotal(followers); 
        } 
      }); 
    }
    function behance(){
      //Behance
      $.ajax({
        url: 'https://api.behance.net/v2/users/'+settings.behance_user,
        dataType: 'jsonp',
        type: 'GET',
        data:{
          client_id: settings.behance_client_id
        },
        success: function(data) {   
          var followers = parseInt(data.user.stats.followers);
          var k = kFormatter(followers);
          $('#wrapper .item.behance .count').append(k); 
          $('#wrapper .item.behance').attr('href','https://behance.net/'+settings.behance_user);
          getTotal(followers); 
        } 
      }); 
    }
    function vine(){
      $.ajax({
        url: '../SocialCounters/vine/vine.php',
        dataType: 'json',
        type: 'GET',
        data:{
          user: settings.vine_user
        },
        success: function(data) {
          var followers = parseInt(data.followers);
          var k = kFormatter(followers);
          $('#wrapper .item.vine .count').append(k); 
          $('#wrapper .item.vine').attr('href','https://vine.co/u/'+settings.vine_user);
          getTotal(followers); 
        } 
      });
    }
    function vk(){
      //VK API
      $.ajax({
        url: 'https://api.vk.com/method/users.getFollowers',
        dataType: 'jsonp',
        type: 'GET',
        data:{
          user_id: settings.vk_id
        },
        success: function(data) {
          var followers = parseInt(data.response.count);
          var k = kFormatter(followers);
          $('#wrapper .item.vk .count').append(k); 
          $('#wrapper .item.vk').attr('href','https://vk.com/id'+settings.vk_id);
          getTotal(followers); 
        } 
      });
    }
    function foursquare(){
      //Foursquare API - GET ID
      $.ajax({
        url: 'https://api.foursquare.com/v2/users/search',
        dataType: 'jsonp',
        type: 'GET',
        data:{
          twitter: settings.foursquare_user,
          oauth_token: settings.foursquare_token,
          v:'20131017',
        },
        success: function(data) {
          //Get user ID
          var id = data.response.results[0].id;
          //Foursquare API - GET FRIENDS COUNT
          $.ajax({
            url: 'https://api.foursquare.com/v2/users/'+id,
            dataType: 'jsonp',
            type: 'GET',
            data:{
              oauth_token: settings.foursquare_token,
              v:'20131017'
            },
            success: function(data) {    
              var followers = parseInt(data.response.user.friends.count);
              var k = kFormatter(followers);
              $('#wrapper .item.foursquare .count').append(k); 
              $('#wrapper .item.foursquare').attr('href','https://foursquare.com/'+settings.foursquare_user);
              getTotal(followers); 
            } 
          });
        } 
      });
    }
    function linkedin(){
      $.ajax({
        url: 'https://api.linkedin.com/v1/people/~:(num-connections,public-profile-url)',
        dataType:'jsonp',
        type:'GET',
        data:{
          oauth2_access_token:settings.linkedin_oauth,
          format:'jsonp'
        },
        success: function(data){
          var connections = parseInt(data.numConnections);
          var k = kFormatter(connections);
          $('#wrapper .item.linkedin .count').append(k); 
          $('#wrapper .item.linkedin').attr('href',data.publicProfileUrl);
          getTotal(connections); 
        }
      });
    }
    function tumblr(){
      $.ajax({
        url: '../SocialCounters/tumblr/callback.php',
        dataType: 'json',
        type: 'GET',
        data:{
          user: settings.tumblr_username
        },
        success: function(data) {
          var followers = parseInt(data.followers);
          var k = kFormatter(followers);
          $('#wrapper .item.tumblr .count').append(k); 
          $('#wrapper .item.tumblr').attr('href','https://'+settings.tumblr_username+'.tumblr.com');
          getTotal(followers); 
        } 
      });
    }
    function twitch(){
      $.ajax({
        url: 'https://api.twitch.tv/kraken/channels/'+settings.twitch_username,
        dataType: 'json',
        type: 'GET',
        data:{
          client_id: settings.twitch_client_id
        },
        success: function(data) {
          var followers = parseInt(data.followers);
          var k = kFormatter(followers);
          $('#wrapper .item.twitch .count').append(k); 
          $('#wrapper .item.twitch').attr('href','https://www.twitch.tv/'+settings.twitch_username+'/profile');
          getTotal(followers); 
        } 
      });
    }
    function spotifyArtist(){
        $.ajax({
            url:'https://api.spotify.com/v1/artists/'+settings.spotify_artist_id,
            dataType:'json',
            type:'GET',
            success: function(data){
              var followers = parseInt(data.followers.total);
              var k = mFormatter(followers);
              $('#wrapper .item.spotify_artist .count').append(k); 
              $('#wrapper .item.spotify_artist').attr('href','https://open.spotify.com/artist/'+settings.spotify_artist_id);
              getTotal(followers);    
            }
        });
    }
    function spotifyUser(){
        $.ajax({
            url:'https://api.spotify.com/v1/users/'+settings.spotify_user_id,
            dataType:'json',
            type:'GET',
            success: function(data){
              var followers = parseInt(data.followers.total);
              var k = mFormatter(followers);
              $('#wrapper .item.spotify_user .count').append(k); 
              $('#wrapper .item.spotify_user').attr('href','https://open.spotify.com/users/'+settings.spotify_user_id);
              getTotal(followers);    
            }
        });
    }
    //Function to add commas to the thousandths
    $.fn.digits = function(){ 
      return this.each(function(){ 
        $(this).text( $(this).text().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,") ); 
      })
    }
    //Function to add K to thousands
    function kFormatter(num) {
      return num > 999 ? (num/1000).toFixed(1) + 'k' : num;
    }
    //Function to add K to thousands
    function mFormatter(num) {
      return num > 999999 ? (num/1000000).toFixed(1) + 'm' : num;
    }
    //Total Counter
    var total = 0;
    //Get an integer paramenter from each ajax call
    function getTotal(data) {
      total = total + data;
      $("#total").html(total).digits();
      $("#total_k").html(kFormatter(total));
    }

    function linkClick(){
      $('#wrapper .item').attr('target','_blank');
    }
    linkClick();

    //Call Functions
    if(settings.twitter_user!=''){ 
      twitter(); 
    } if(settings.facebook_user!='' && settings.facebook_token!=''){ 
      facebook(); 
    } if(settings.instagram_user!='' && settings.instagram_token!=''){ 
      instagram();
    } if(settings.instagram_user_sandbox!='' && settings.instagram_token!=''){ 
      instagram_sandbox();
    }if(settings.google_plus_id!='' && settings.google_plus_key!=''){ 
      google();
    } if(settings.linkedin_oauth!=''){ 
      linkedin(); 
    } if(settings.youtube_user!='' && settings.youtube_key!=''){ 
      youtube(); 
    } if(settings.youtube_user_square!='' && settings.youtube_key!=''){ 
      youtubeSquare(); 
    } if(settings.vine_user!=''){ 
      vine(); 
    } if(settings.pinterest_user!=''){ 
      pinterest(); 
    } if(settings.dribbble_user!='' && settings.dribbble_token!=''){ 
      dribbble();
    } if(settings.soundcloud_user_id!='' && settings.soundcloud_client_id!=''){ 
      soundcloud(); 
    } if(settings.vimeo_user!='' && settings.vimeo_token!=''){ 
      vimeo();
    } if(settings.github_user!=''){ 
      github();
    } if(settings.behance_user!='' && settings.behance_client_id!=''){ 
      behance(); 
    } if(settings.vk_id!=''){ 
      vk(); 
    } if(settings.foursquare_user!='' && settings.foursquare_token!=''){ 
      foursquare(); 
    } if(settings.tumblr_username!=''){ 
      tumblr(); 
    } if(settings.twitch_username!='' && settings.twitch_client_id!=''){ 
      twitch(); 
    } if(settings.spotify_artist_id!=''){ 
      spotifyArtist(); 
    }if(settings.spotify_user_id!=''){ 
      spotifyUser(); 
    }
  };
}(jQuery));



    
})();