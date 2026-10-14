SAHIL & TASLEEMA — INVITATION STUDIO
====================================

HOW TO OPEN
1. Extract the ZIP file.
2. Open the extracted folder.
3. Double-click index.html to preview on your computer.
4. On a phone, extract the ZIP using Files and open index.html in a browser.
   Some phone browsers restrict local files. For a shareable public link, host the folder online.

CHANGE THE MUSIC (EASY)
1. Open the music folder.
2. Put your chosen audio file there.
3. Rename your audio file to EXACTLY: engagement.mp3
4. Replace the existing placeholder file with your own song.
5. Keep the same folder path: music/engagement.mp3
6. Refresh the website. Tap "Play our music" to start it.
   You do not need to edit code if you keep the same filename and format.

If your song is named something else or uses another format:
- Open config.js in a text editor.
- Change musicPath to the correct relative path, for example:
  musicPath: "music/my-song.mp3"
- Make sure the actual file exists at that path.
- The file extension must match the real file type.

MUSIC NOTE
No copyrighted song is bundled. Add a song you have permission to use.
Phones generally require a tap before audio can play; this is normal browser behaviour.
Music will restart when moving to another HTML page because each page is a separate document.

CUSTOMISE DETAILS
Open config.js and edit:
- eventDate: date/time in ISO format with timezone
- eventDateLabel and eventTimeLabel
- venue
- whatsappNumber: family WhatsApp number, digits only, including country code (e.g. 919876543210)
The RSVP page opens WhatsApp with a pre-filled message. It does not silently send anything.

CHANGE EVENT SCHEDULE
Open celebration.html and edit the timeline items and venue text.
The map currently searches "Najan, Kashmir"; replace the Google Maps search URL with the exact venue before sharing.

ADD GALLERY PHOTOS FOR EVERYONE
The gallery's "Add Photos" feature is only a browser preview.
For permanent photos, copy images into the assets folder, then edit gallery.html to add <img src="assets/your-photo.jpg" alt="..."> inside gallery tiles.
Photos uploaded using the preview tool are not automatically sent to other guests.

GUEST WISHES
Wishes are stored in local browser storage on the current device only. Shared/online guestbook needs a backend/database.

PAGES
index.html       Main invitation and countdown
story.html       Family note / story
celebration.html Schedule, venue, directions, calendar
gallery.html     Photo gallery and local preview upload
wishes.html      Guestbook demo
rsvp.html        WhatsApp RSVP form
config.js        Main editable settings and music path
style.css        Design and responsive styling
app.js           Interactive features
music/           Put engagement.mp3 here
assets/          Put permanent gallery images here

DESIGN INSPIRATION
Includes common digital-invitation patterns such as a cinematic opening, background music controls,
countdown, event schedule, venue directions, gallery, calendar link, WhatsApp RSVP and wishes wall.
This is an original implementation, not a copy of another site's source code or exact design.
