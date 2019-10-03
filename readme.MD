# Welcome
This is the repository for [gustavwengel.dk](https://gustavwengel.dk), my personal blog where I primarily
write about programming. It's a Jekyll site, hosted on github pages.


Pull requests are welcome.


# How to get this thing running
- `gem install bundler`
- `bundle update --bundler`
- `bundle update github-pages`
- `bundle install --path vendor/bundle`
- `bundle exec jekyll serve`


# Errors

`Ignoring commonmarker-0.17.10 because its extensions are not built. Try: gem pristine commonmarker --version 0.17.10`
then
`gem pristine --all`
or just reinstall everything


# How to hide a post
If you mark a post as
`draft: True`
it will not show up on the webpage
