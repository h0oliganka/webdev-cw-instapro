import { renderHeaderComponent } from "./header-component.js";
import { uploadImage } from "../api.js";
// import { getToken } from "../index.js";
let imgFileUrl = null;

export function renderAddPostPageComponent({ appEl, onAddPostClick }) {
  const render = () => {
    // TODO: Реализовать страницу добавления поста
    const appHtml = `
    <div class="page-container">
      <div class="header-container"></div>
      <div class="form">
        <h3 class="form-title">Добавить пост</h3>
          <div class="form-inputs">
              <div class="upload-image-container">
${!imgFileUrl ? `<div class="upload=image">
                <label class="file-upload-label secondary-button">
                  <input type="file" class="file-upload-input" style="display:none">
                      Выберите фото
                </label>` : `<img class="file-upload-image" src=${imgFileUrl}></img> <button class="file-upload-remove-button button">Заменить фото</button>`}
      </div>
</div>
        <label>
          Опишите фотографию:
          <textarea class="input textarea" rows="4"></textarea>
          </label>
          <button class="button" id="add-button">Добавить</button>
      </div>
    </div>
    </div>
  `;

    appEl.innerHTML = appHtml;

    renderHeaderComponent({
      element: document.querySelector(".header-container"),
    });
    !imgFileUrl ? undefined : document.querySelector('.file-upload-remove-button').addEventListener('click', () => {
      imgFileUrl = null;
      render();
      initFileInputElement();
    })

    document.getElementById("add-button").addEventListener("click", () => {
      onAddPostClick({
        description: document.querySelector('.textarea').value,
        imageUrl: imgFileUrl,
      });
      imgFileUrl = null;
    });
  };
  render();
  initFileInputElement();
  function initFileInputElement() {
    const fileInputElement = document.querySelector('.file-upload-input');
    fileInputElement.addEventListener('input', () => {
      uploadImage({ file: fileInputElement.files[0] })
        .then((response) => {
          imgFileUrl = response.fileUrl;
          render();
        })
    });
  }
}
