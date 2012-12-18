use Rack::Static,
  :urls => ["/images", "/javascripts", "/compiled_css"],
  :root => "public"

run lambda { |env|
  [
    200,
    {
      'Content-Type'  => 'text/html',
      'Cache-Control' => 'public, max-age=3600'
    },
    File.open('public/index.html', File::RDONLY)
  ]
}

