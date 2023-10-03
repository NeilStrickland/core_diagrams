<?php

require_once('../MAS106.php');

// $labels = $course->parse_aux_labels();
// $keys = $course->parse_youtube_keys();
$labels = array();
$keys = array();

$demos_json = <<<JSON
[
 ["real_setops","Operations on subsets of the reals",[]],
 ["nat_setops","Operationss on finite subsets of the naturals",[]],
 ["prod","Cartesian products",[]],
 ["symdiff","De Morgan's laws and symetric differences",[]]
]
JSON;

$demos0 = json_decode($demos_json);

$demos = array();

foreach($demos0 as $d0) {
 $d = new stdClass();
 $demos[] = $d;
 $d->name = $d0[0];
 $d->title = $d0[1];
 $d->refs = array();
 foreach($d0[2] as $label) {
  $d->refs[] = $labels[$label];
 }
 $d->ref_string = implode(', ', $d->refs);
 if (count($d->refs) > 1) {
  $d->ref_string = str_replace('Example','Ex',$d->ref_string);
 }
 
 $d->youtube_key = '';
 $d->youtube_url = '';
 $d->youtube_link = '';

 if (isset($keys[$d->name])) {
  $d->youtube_key = $keys[$d->name];
  $d->youtube_url = 'https://youtu.be/' . $d->youtube_key;
  $d->youtube_link = <<<HTML
<span class="video_link"><img class="hoverpointer" src="video_icon.png" height="20px"
   onclick="location='{$d->youtube_url}'"</img></span>

HTML;
 }
 
 $d->html = <<<HTML
 <tr>
  <td width="350px"><div style="position:relative"><a href="{$d->name}.html">{$d->title}</a>{$d->youtube_link}</div></td>
  <td width="200px">{$d->ref_string}</td>
 </tr>

HTML;
}

$num_demos = count($demos);
$num_rows = ceil($num_demos / 2);

echo <<<HTML

<html>
 <head>
  <style type="text/css" media="screen">
   @import url(MAS106_demo.css);
   
   table#A {
    position: absolute;
    left: 50px;
    top: 60px;
   }
   
   table#B {
    position: absolute;
    left: 680px;
    top: 60px;
   }

   span.video_link {
    position:absolute;
    right: 5px;
   }
  </style>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.5/MathJax.js"> 
   MathJax.Hub.Config({
    extensions: ["tex2jax.js"],
    jax: ["input/TeX","output/HTML-CSS"],
    tex2jax: {inlineMath: [["$","$"]]}
   });
  </script> 
 </head>
 <body>
  <div id="frame">
   <div  style="margin-left:50px;">
    <h1>Interactive pages for MAS106</h1>
    <table id="A" class="edged">

HTML;

$i = 0;
while ($i < $num_rows) { echo $demos[$i]->html; $i++; }

echo <<<HTML
    </table>
    <table id ="B" class="edged">

HTML;

while ($i < $num_demos) { echo $demos[$i]->html; $i++; }

echo <<<HTML
    </table>
   </div>
  </div>
 </body>
</html>

HTML;
