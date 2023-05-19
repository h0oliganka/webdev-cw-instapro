import { USER_POSTS_PAGE } from "../routes.js";
import { renderHeaderComponent } from "./header-component.js";
import { posts, goToPage, user } from "../index.js";
import { addLike, removeLike } from "../api.js";
import { formatDistanceToNow } from 'date-fns';
import { enGB, eo, ru } from 'date-fns/locale';

export function renderPostsPageComponent({ appEl }) {
  // TODO: реализовать рендер постов из api
  console.log("Актуальный список постов:", posts);

  const postList = posts.map((post, index) => {
    return `<li class="post">
    <div class="post-header" data-user-id=${post.user.id}>
        <img src=${post.user.imageUrl} class="post-header__user-image">
        <p class="post-header__user-name">${post.user.name}</p>
    </div>
    <div class="post-image-container">
      <img class="post-image" src=${post.imageUrl} >
    </div>
    <div class="post-likes">
      <button data-post-id=${post.id} class="like-button">
      <button data-post-id=${post.id} data-post-like=${post.isLiked} class="like-button">
        ${post.isLiked ? '<img src="./assets/images/like-active.svg"></img>' : '<img src="./assets/images/like-not-active.svg"></img>'} 
      </button>
      <p class="post-likes-text">
      ${post.likes.length < 1 ?
        `Нравится: <strong> ${post.likes.length}</strong>` : post.likes.length === 1 ?
          `Нравится: <strong> ${post.likes[0].name} </strong>` :
          `Нравится: <strong> ${post.likes[Math.floor(Math.random() * ((post.likes.length - 1) - 0 + 1)) + 0].name} и еще ${post.likes.length - 1}</strong>`} 
      </p>
    </div>
    <p class="post-text">
      <span class="user-name">${post.user.name}</span>
      ${post.description}
    </p>
    <p class="post-date">
    ${formatDistanceToNow(new Date(post.createdAt), { locale: ru },)} назад
    </p>
  </li>`
  }).join('');
  const appHtml = `
                <div class="page-container">
                  <div class="header-container"></div>
                  <ul class="posts">
                  ${postList}
                  </ul>
                </div>`;
  appEl.innerHTML = appHtml;
  renderHeaderComponent({
    element: document.querySelector(".header-container"),
  });
  for (let userEl of document.querySelectorAll(".post-header")) {
    userEl.addEventListener("click", () => {
      goToPage(USER_POSTS_PAGE, {
        userId: userEl.dataset.userId,
      });
    });
  }

  for (let likeEl of document.querySelectorAll(".like-button")) {
    likeEl.addEventListener('click', () => {
      console.log(likeEl.dataset.postLike);
      if(!user) {
        alert('Лайкать посты могут только авторизованные пользователи');
        return;
      }
      if (likeEl.dataset.postLike === 'false') {
        addLike({ postID: likeEl.dataset.postId, token: `Bearer ${user.token}` })
          .then(() => goToPage(undefined, 'like'))
      } else {
        removeLike({ postID: likeEl.dataset.postId, token: `Bearer ${user.token}` })
          .then(() => goToPage(undefined, 'like'))
      }

    })
  }
}