
### TODO:
- [x] reduce video sizes further
- [x] create posts for each trip
- [x] adjust tag/category thingy
- [x] fix video for main page
- [x] write small guide
	- [ ] update the guide
- [x] black page before video
- [x] fix audio k page
- [x] check that the page looks ok on mobile
- [ ] start writing some posts
- [ ] figure out how toc works
- [x] change the accent color to yellow
- [x] <del>figure out photoswipe</del> used alternate package native to jekyll
- [x] fix mobile navbar

- [ ] More video fixes
	- [x] multiple filesizes for different internet speeds
	- [x] make slovenia reel
	- [x] rehost on different provider
	- [x] adjust folder structure
	- [x] mobile optimization script
  - [ ] mobile video is still not auto-loading 

- [x] add gpx map support
	- [x] Implement the map for kyrg
  - [ ] Implement the map for norway
  - [ ] Implement the map for slovenia 
	
- [ ] More photo fixes
	- [x] create working galleries for each trip
	- [x] select a bunch of nice photos to start with
	- [x] add captions for photos
	- [x] add arrows and swipe support
	- [x] add thumbnails for each trip
  - [ ] migrate photo storage to cloudinary, like video

- [ ] polish up the logo a bit more, tighten up the borders I think
- [x] fix the favicon and page header




## How to:

### Add a new blog post:

1. In the _posts folder, add a new .md file with your post content. (Easiest way is to copy an existing one and just that as a template.
2. Posts are written in markdown. There are a few custom features included such as embedded gpx maps and image galleries, whose implementation is described below. [This is a good markdown guide](https://www.writethedocs.org/guide/writing/markdown/)
3. There are a lot of editors that allow markdown editing with live preview. VSCode or Notepad++ are good options.
4. Once you're done editing a new post, you can commit and push it to the main branch. The site will automatically rebuild and deploy it after a few minutes.

---
### Add an image gallery to a post
TODO: to be written after adjusting file hosting for images


---
### Reduce file size of a gpx
1. Go to https://gpx.studio/ and upload your file
2. Use the minify tool (looks like a little funnel) and reduce the number of tracking points.
3. Download your file (ideally should be under 50kb for fast embedding)

---
### How to add a GPX map to a post
1. Go to the kyrgyzstan post
2. Copy the 13 lines of code between <!-- Map Container --> and /script
3. Paste these in your new blog post
4. Upload your new gpx file to /assets/maps/
5. Replace the map in the line initGPXMap('kyrg-map', '/assets/maps/yourmap.gpx'); in your new blog post 

---
### Host a new video or photo 
1. Go to https://cloudinary.com/
2. Login using adventuresquad github account
3. Upload videos to video folder
4. Embed into a post using raw URL (see example in existing posts)






