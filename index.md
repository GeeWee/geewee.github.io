  {% for post in site.posts %}
    {{ post.title}}
    
    {{ post.excerpt }}
  {% endfor %}