window.addEventListener("scroll", function () {
  const endOfPage =
    window.innerHeight + window.pageYOffset >= document.body.offsetHeight;
  if (endOfPage && currentPage < lastPage) {
    currentPage = currentPage + 1;
    getPosts(false, currentPage);
  }
});

function setupUI(id = "") {
  let loginDiv = document.getElementById("login-div");
  let logoutDiv = document.getElementById("logout-div");
  let addPost = document.getElementById("addPost");
  let token = localStorage.getItem("token");

  if (token == null) {
    if (addPost != null) {
      addPost.style.setProperty("display", "none", "important");
    }
    loginDiv.style.setProperty("display", "block", "important");
    logoutDiv.style.setProperty("display", "none", "important");
  } else {
    if (addPost != null) {
      addPost.style.setProperty("display", "block", "important");
    }
    loginDiv.style.setProperty("display", "none", "important");
    logoutDiv.style.setProperty("display", "block", "important");
    const obj = localStorage.getItem("user");
    let profailImage = "./imgs/lost.png";
    user = JSON.parse(obj);
    if (Object.keys(user.profile_image).length !== 0) {
      profailImage = user.profile_image;
    }
    document.getElementById("nameOfUser").innerHTML = user.username;
    document
      .getElementById("profile-img")
      .setAttribute("src", `${profailImage}`);
  }
  if (window.location.href === "http://127.0.0.1:5500/home.html") {
    getPosts();
  }
  console.log(id);
  if (
    window.location.href ===
    "http://127.0.0.1:5500/detailPost.html?id=" + id
  ) {
    getPost(id);
  }
}

function createNewPostClick() {
  let postId = document.getElementById("idPost").value;
  const title = document.getElementById("post-title-input").value;
  const body = document.getElementById("post-body-input").value;
  const image = document.getElementById("post-image-input").files[0];
  const token = localStorage.getItem("token");
  isCreate = postId == null || postId == "";

  let formData = new FormData();
  formData.append("title", title);
  formData.append("body", body);
  formData.append("image", image);

  const headers = {
    authorization: `Bearer ${token}`,
  };

  let url = "";

  if (isCreate) {
    url = `${baseUrl}/posts`;
  } else {
    url = `${baseUrl}/posts/${postId}`;
    formData.append("_method", "put");
  }
  toggelLoader();
  axios
    .post(url, formData, {
      headers: headers,
    })
    .then((response) => {
      const modal = document.getElementById("create-post-modal");
      const modalInstance = bootstrap.Modal.getInstance(modal);
      modalInstance.hide();

      showAlert(" Post Has Been Update");
      getPosts();
    })
    .catch((error) => {
      const message = error.response.data.message;
      showAlert(message, "danger");
    })
    .finally(() => {
      toggelLoader(false);
    });
}

function loginClick() {
  let username = document.getElementById("username-input").value;
  let password = document.getElementById("password-input").value;

  let parms = {
    username: username,
    password: password,
  };
  toggelLoader();
  axios
    .post(`${baseUrl}/login`, parms)
    .then((res) => {
      token = res.data.token;
      user = res.data.user;

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      const modal = document.getElementById("login-modal");
      const modalInstance = bootstrap.Modal.getInstance(modal);
      modalInstance.hide();

      setupUI();
      showAlert("Login has successfully");
      getPosts();
    })
    .catch((error) => {
      const message = error.response.data.message;
      showAlert(message, "danger");
    })
    .finally(() => {
      toggelLoader(false);
    });
}

function registerClick() {
  const name = document.getElementById("Rname-input").value;
  const username = document.getElementById("Rusername-input").value;
  const password = document.getElementById("Rpassword-input").value;
  const image = document.getElementById("formFile").files[0];

  formData = new FormData();
  formData.append("username", username);
  formData.append("name", name);
  formData.append("password", password);
  formData.append("image", image);

  toggelLoader();
  axios
    .post(`${baseUrl}/register`, formData)
    .then((res) => {
      token = res.data.token;
      localStorage.setItem("token", token);
      localStorage.setItem("user", res.data.user);

      const modal = document.getElementById("register-modal");
      const modalInstance = bootstrap.Modal.getInstance(modal);
      modalInstance.hide();

      showAlert("New user registered successfully");
      setupUI();
    })
    .catch((error) => {
      const message = error.response.data.message;
      showAlert(message, "danger");
    })
    .finally(() => {
      toggelLoader(false);
    });
}

function logoutClick() {
  localStorage.removeItem("user");
  localStorage.removeItem("token");
  showAlert("Logged out successfully");
  setupUI();
}

function showAlert(message, type = "success") {
  var loginAlert = document.getElementById("alertSucess");

  const alert = (message, type) => {
    var wrapper = document.createElement("div");
    wrapper.innerHTML =
      '<div class="alert alert-' +
      type +
      ' alert-dismissible" role="alert" >' +
      message +
      '<button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button></div>';

    loginAlert.append(wrapper);
  };

  alert(message, type);

  setTimeout(function () {
    // var alertNode = document.querySelector('#alertSucess')
    // var alertt = bootstrap.Alert.getOrCreateInstance(alertNode)
    // alertt.close()
    document.querySelector(".btn-close").click();
  }, 2000);
}

function getCurrentUser() {
  let user = false;
  let storageUser = localStorage.getItem("user");

  if (storageUser != null) {
    user = JSON.parse(storageUser);
  }
  return user;
}

function getProfail(user) {
  const obj = JSON.parse(decodeURIComponent(user));
  userId = obj.id;
  window.location.assign(`./profail.html?id=${userId}`);
}

function editPost(obj) {
  let postObj = JSON.parse(decodeURIComponent(obj));
  document.getElementById("idPost").value = postObj.id;
  document.getElementById("btn-post").innerHTML = "Update";
  document.getElementById("exampleModalLabel").innerHTML = "Edit Post";
  document.getElementById("post-title-input").value = postObj.title;
  document.getElementById("post-body-input").value = postObj.body;

  let postModal = new bootstrap.Modal(
    document.getElementById("create-post-modal"),
    {}
  );
  postModal.toggle();
}

function addBtnClicked() {
  document.getElementById("idPost").value = "";
  document.getElementById("btn-post").innerHTML = "Create";
  document.getElementById("exampleModalLabel").innerHTML = "Create A New Post";
  document.getElementById("post-title-input").value = "";
  document.getElementById("post-body-input").value = "";
  let postModal = new bootstrap.Modal(
    document.getElementById("create-post-modal"),
    {}
  );
  postModal.toggle();
}

function confirmPostDelete(obj) {
  let postModal = new bootstrap.Modal(
    document.getElementById("DeleteModelPost"),
    {}
  );
  postModal.toggle();
  const postObj = JSON.parse(decodeURIComponent(obj));
  document.getElementById("sendIdPost").value = postObj.id;
}

function deletePost() {
  let id = document.getElementById("sendIdPost").value;
  const token = localStorage.getItem("token");

  const headers = {
    authorization: `Bearer ${token}`,
  };

  axios
    .delete(`${baseUrl}/posts/${id}`, {
      headers: headers,
    })
    .then((response) => {
      const modal = document.getElementById("DeleteModelPost");
      const modalInstance = bootstrap.Modal.getInstance(modal);
      modalInstance.hide();
      showAlert("Post Has Been Deleted");
      getPosts();
    })
    .catch((error) => {
      const message = error.response.data.message;
      showAlert(message, "danger");
    });
}

function toggelLoader(show = true) {
  if (show) {
    document.getElementById("loader").style.visibility = "visibel";
  } else {
    document.getElementById("loader").style.visibility = "hidden";
  }
}
