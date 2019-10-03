# How to get this thing running

- gem install bundler
- bundle update --bundler (maybe)
- bundle update github-pages
- bundle install --path vendor/bundle
- bundle exec jekyll serve


# If you get
`Ignoring commonmarker-0.17.10 because its extensions are not built. Try: gem pristine commonmarker --version 0.17.10`
then ??? 
gem pristine --all
or just reinstall erryythingm


# How to hide a post
If you mark a post as
draft: True
it will not show up on the webpage
