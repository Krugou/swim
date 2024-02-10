<?php

// Get the URL to fetch from the query string
$url = $_GET['url'];

// Create a new cURL resource
$ch = curl_init();

// Set the URL and other options
curl_setopt($ch, CURLOPT_URL, $url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

// Execute the request and get the response
$response = curl_exec($ch);

// Close the cURL resource
curl_close($ch);

// Output the response
echo $response;