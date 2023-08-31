const baseUrl = "https://tarmeezacademy.com/api/v1";
let currentPage = 1;
let lastPage = 1;
const login = document.getElementById("btnLogin");
const register = document.getElementById("btnRegister");

function getPosts(reload = true, page = 1) {
  toggelLoader();
  axios
    .get(`${baseUrl}/posts?limit=6&page=${page}`)
    .then((response) => {
      return response.data;
    })
    .then((res) => {
      lastPage = res.meta.last_page;
      if (reload) {
        document.getElementById("posts").innerHTML = "";
      }

      for (const response of res.data) {
        let profailImage = "./imgs/lost.png";
        if (Object.keys(response.author.profile_image).length !== 0) {
          profailImage = response.author.profile_image;
        }
        console.log(profailImage);
        let user = getCurrentUser();
        let isMyPost = user.id == response.author.id;
        let editBtnContent = "";
        if (isMyPost) {
          editBtnContent = `<svg onclick="editPost('${encodeURIComponent(
            JSON.stringify(response)
          )}')" style="cursor: pointer;" class="me-2" xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-pencil-square" viewBox="0 0 16 16">
                              <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/>
                              <path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z"/>
                          </svg>
                          <svg onclick="confirmPostDelete('${encodeURIComponent(
                            JSON.stringify(response)
                          )}')" style="cursor: pointer;" xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-x-lg" viewBox="0 0 16 16">
                            <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8 2.146 2.854Z"/>
                          </svg>`;
        }
        let post = `<div class="container">
        <div class="mt-4 d-flex justify-content-center ">
          <div class="col-9 ">
            <!-- start poste -->
              <div class="card rounded">
                <div class="card-header">
                  <span style="cursor: pointer;" onclick="getProfail('${encodeURIComponent(
                    JSON.stringify(response.author)
                  )}')">
                    <img
                      src="${profailImage}"
                      class="rounded-circle border border-3"
                      style="width: 40px; height: 40px"
                    />
                    <b>${response.author.username}</b>
                  </span>
                  <span class="float-end" >
                    ${editBtnContent}
                  </span>
                </div>
                <div class="card-body" style="cursor: pointer;" onclick="getPostDetail(${
                  response.id
                })">
                  <img
                    class=" card-img-top"
                    src="${response.image}"
                    alt=""
                  />
                  <span class="card-text">
                    <small class="text-muted">${response.created_at}</small>
                  </span>
                  <h5 class="card-title mt-2">${
                    response.title === null
                      ? (response.title = "")
                      : response.title
                  }</h5>
                  <p class="card-text">
                    ${response.body}
                  </p>
                  <hr>
                  <span id='nbComments-${response.id}' onclick="getComments(${
          response.id
        })">
                    <svg  xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pen" viewBox="0 0 16 16">
                    <path d="m13.498.795.149-.149a1.207 1.207 0 1 1 1.707 1.708l-.149.148a1.5 1.5 0 0 1-.059 2.059L4.854 14.854a.5.5 0 0 1-.233.131l-4 1a.5.5 0 0 1-.606-.606l1-4a.5.5 0 0 1 .131-.232l9.642-9.642a.5.5 0 0 0-.642.056L6.854 4.854a.5.5 0 1 1-.708-.708L9.44.854A1.5 1.5 0 0 1 11.5.796a1.5 1.5 0 0 1 1.998-.001zm-.644.766a.5.5 0 0 0-.707 0L1.95 11.756l-.764 3.057 3.057-.764L14.44 3.854a.5.5 0 0 0 0-.708l-1.585-1.585z"/>
                    </svg>(${response.comments_count})Comments
                    <span id="tags-${response.id}"></span>
                  </span>
                </div>
            <!-- end postes -->
            <div id='allComments-${response.id}'></div>
            </div>
          </div>
        </div>
      </div>`;
        document.getElementById("posts").innerHTML += post;
        document.getElementById(`tags-${response.id}`).innerHTML = "";
        tg = response.tags;

        for (tag of tg) {
          document.querySelector(
            `tags-${response.id}`
          ).innerHTML += `<button class="btn btn-sm rounded-5" type="button" style="background-color: gray; color: white;">${tag.name}</button>`;
        }
      }
    })
    .finally(() => {
      toggelLoader(false);
    });
}

function getPostDetail(idpost) {
  window.location.assign(`./detailPost.html?id=${idpost}`);
}
