# Create your views here.
from models import Note
from django.views.decorators.csrf import ensure_csrf_cookie
from django.http import HttpResponseRedirect, HttpResponseServerError

@ensure_csrf_cookie
def create_note(request, callback_args = []):
    error_msg = u"No POST data sent."
    if request.method == "POST":
        post = request.POST.copy()
        if post.has_key('slug') and post.has_key('title'):
            slug = post['slug']
            if Note.objects.filter(slug=slug).count() > 0:
                error_msg = u"Slug already in use."
            else:
                title = post['title']
                new_note = Note.objects.create(title=title,slug=slug)
                return HttpResponseRedirect(new_note.get_absolute_url())
        else:
            error_msg = u"Insufficient POST data (need 'slug' and 'title'!)"
    return HttpResponseServerError(error_msg)

@ensure_csrf_cookie
def update_note(request, slug):
    if request.method == "POST":
        post = request.POST.copy()
        note = Note.objects.get(slug=slug)
        if post.has_key('slug'):
            slug_str = post['slug']
            if note.slug != slug_str:
                if Note.objects.filter(slug=slug_str).count() > 0:
                    error_msg = u"Slug already taken."
                    return HttpResponseServerError(error_msg)
                note.slug = slug_str
        if post.has_key('title'):
            note.title = post['title']
        if post.has_key('text'):
            note.text = post['text']
        note.save()
        return HttpResponseRedirect(note.get_absolute_url())
    error_msg = u"No POST data sent."
    return HttpResponseServerError(error_msg)