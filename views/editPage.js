const html = require("html-template-tag");
const layout = require("./layout");

module.exports = (page, user) => layout(html`
  <h3>Edit a Page</h3>
  <hr>
  <form method="POST" action="/wiki/${page.slug}?_method=PUT">

    <div>
      <label for="author" class="col-sm-2 control-label">Author Name</label>
      <div class="col-sm-10">
        <input name="author" type="text" class="form-control" value="${user.name}"/>
      </div>
    </div>
    
    <div>
      <label for="author_email" class="col-sm-2 control-label">Author Email</label>
      <div class="col-sm-10">
        <input name="author_email" type="text" class="form-control" value="${user.email}"/>
      </div>
    </div>

    <div class="form-group">
      <label for="title" class="col-sm-2 control-label">Page Title</label>
      <div class="col-sm-10">
        <input name="title" type="text" class="form-control" value="${page.title}"/>
      </div>
    </div>

    <div>
      <label for="content" class="col-sm-2 control-label">Content</label>
      <div class="col-sm-10">
        <input name="content" type="text" class="form-control" value="${page.content}"/>
      </div>
    </div>

    <div class="form-group">
      <label for="content" class="col-sm-2 control-label">Status</label>
      <div class="col-sm-10">
        <select name="status">
          <option ${page.status == "open" ? "selected" : ""}>open</option>
          <option ${page.status == "closed" ? "selected" : ""}>closed</option>
        </select>
      </div>
    </div>

    <div class="col-sm-offset-2 col-sm-10">
        <button type="submit" class="btn btn-primary">submit</button>
    </div>
  </form>
`);
