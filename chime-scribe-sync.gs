/**
 * Chime Scribe → Google Docs connector.
 *
 * ONE-TIME SETUP
 *  1. Go to https://script.google.com  →  New project
 *  2. Delete the sample code, paste this whole file, and Save.
 *  3. Deploy ▸ New deployment ▸ choose "Web app".
 *       Execute as:      Me
 *       Who has access:  Anyone
 *     Deploy, then Allow access when prompted.
 *  4. Copy the "Web app URL" (ends in /exec) and paste it into the app, Step 2.
 *  5. In the app, Step 3: paste your Google Doc's link and press Connect.
 *
 * Every note you log is added to your doc in real time. Erasing a note
 * in the app also removes it from the doc (each entry is tracked with a
 * hidden named range keyed to its ID).
 */

function doGet(e)  { return handle_(e, true);  }
function doPost(e) { return handle_(e, false); }

function handle_(e, isGet) {
  var cb = (e && e.parameter) ? e.parameter.callback : null;
  var out;
  try {
    var data = isGet ? JSON.parse(e.parameter.data || '{}') : JSON.parse(e.postData.contents);
    out = writeDoc_(data);
  } catch (err) {
    out = { ok: false, error: String(err) };
  }
  if (cb) {
    return ContentService.createTextOutput(cb + '(' + JSON.stringify(out) + ')')
      .setMimeType(ContentService.MimeType.JAVASCRIPT);
  }
  return ContentService.createTextOutput(JSON.stringify(out))
    .setMimeType(ContentService.MimeType.JSON);
}

function writeDoc_(data) {
  if (!data.docId) return { ok: false, error: 'No document linked' };
  var doc = DocumentApp.openById(data.docId);
  var body = doc.getBody();

  if (data.verify) {
    body.appendParagraph('\u2713 Chime Scribe connected \u2014 ' + new Date().toLocaleString())
        .editAsText().setForegroundColor('#2b6c78');
    return { ok: true, verify: true };
  }

  if (data.eraseIds && data.eraseIds.length) {
    var removed = 0;
    data.eraseIds.forEach(function (id) { if (eraseEntry_(doc, id)) removed++; });
    return { ok: true, erased: removed };
  }

  var entries = data.entries || (data.entry ? [data.entry] : []);
  entries.forEach(function (en) {
    var h = body.appendParagraph('Entry ' + en.seq + '  \u00B7  ' + en.type);
    h.setHeading(DocumentApp.ParagraphHeading.HEADING3);
    var m = body.appendParagraph('Logged: ' + en.logged);
    m.editAsText().setForegroundColor('#666666').setFontSize(9);
    var t = body.appendParagraph(en.text);
    var sp = body.appendParagraph('');
    if (en.id) {
      try {
        var range = doc.newRange()
          .addElement(h).addElement(m).addElement(t).addElement(sp).build();
        doc.addNamedRange('cs_' + en.id, range);
      } catch (e2) {}
    }
  });
  return { ok: true, added: entries.length };
}

function eraseEntry_(doc, id) {
  var ranges = doc.getNamedRanges('cs_' + id);
  if (!ranges || !ranges.length) return false;
  ranges.forEach(function (nr) {
    var els = nr.getRange().getRangeElements();
    for (var i = els.length - 1; i >= 0; i--) {
      try { els[i].getElement().removeFromParent(); } catch (e3) {}
    }
    try { nr.remove(); } catch (e4) {}
  });
  var body = doc.getBody();
  if (body.getNumChildren() === 0) body.appendParagraph('');
  return true;
}
