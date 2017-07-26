<?php
    header('Access-Control-Allow-Origin: *'); 
    header('Content-type: application/json');
    require_once('TwitterAPIExchange.php'); //get it from https://github.com/J7mbo/twitter-api-php

    /** Set access tokens here - see: https://dev.twitter.com/apps/ **/
    $settings = array(
    'oauth_access_token' => "882878753575026688-aYLd5VVxyb3rUa3ghLAd6hcCCzVI7sJ",
    'oauth_access_token_secret' => "Hn5l43kRWYI78l7PNCEGFOTfIARVckHb8xVMT4n6Apyhi",
    'consumer_key' => "DjVhsbwezBxQfMeo2c9XDbKx5",
    'consumer_secret' => "EB8ha9BXm8WZ5gkeGJNPORs9C698blCtGviUwH3kmqrGKFQMpn"
    );
    $twitter_username = $_GET['user'];
    $ta_url = 'https://api.twitter.com/1.1/statuses/user_timeline.json';
    $getfield = '?screen_name='.$twitter_username;
    $requestMethod = 'GET';
    $twitter = new TwitterAPIExchange($settings);
    $follow_count=$twitter->setGetfield($getfield)
    ->buildOauth($ta_url, $requestMethod)
    ->performRequest();
    $data = json_decode($follow_count, true);
    $followers_count=$data[0]['user']['followers_count'];
    $json_array = array('followers'=>$followers_count);
    echo json_encode($json_array);
