const $ = require('jquery');

$(function(){
  // addTodo(todoの追加)
  $(".js-add-todo").on("click", function (e) {
    e.preventDefault();

    // inputの値を取得→中身を空に
    const text = $(".js-get-val").val();
    $(".js-get-val").val("");

    // 入力が空の場合
    if (!text) {
      $(".js-toggle-error").show();
      return;
    }

    // エラーを隠す
    $(".js-toggle-error").hide();

    // リストに追加する(後ろに追加)
    const listItem =
      '<li class="p-listItem p-todoItem js-list_item" data-text="' + text + '">' +
      '<i class="far fa-circle c-listIcon p-todoItem__icon js-to-done"></i>' +
      '<span class="p-listItem__text js-todo_list-text">' +
      text +
      "</span>" +
      '<input type="text" class="js-todo_list-editArea" value="' +
      text +
      '">' +
      '<i class="fas fa-trash-alt c-listIcon p-listItem__trash js-to-delete"></i>' +
      "</li>";

    $(".js-todo_list").append(listItem);
  });

  // doneタスクにする(todo→done)
  // 今までの書き方($('.js-to-done').on())だと、新しく追加したタスクに反映されないため、$(document).on()という使い方にする
  $(document).on("click", ".js-to-done", function () {
    $(this)
      .closest(".js-list_item")
      .addClass("p-doneItem")
      .removeClass("p-todoItem");
    $(this)
      .addClass("fas fa-check-circle p-doneItem__icon js-to-todo")
      .removeClass("far fa-circle p-todoItem__icon js-to-done");
  });


  // todoタスクにする(done→todo)
  $(document).on("click", ".js-to-todo", function () {
    $(this)
      .closest(".js-list_item")
      .addClass("p-todoItem")
      .removeClass("p-doneItem");
    $(this)
      .removeClass("fas fa-check-circle p-doneItem__icon js-to-todo")
      .addClass("far fa-circle p-todoItem__icon js-to-done");
  });


// タスクを削除する
$(document).on('click', '.js-to-delete', function(){
    $(this).closest(".js-list_item").fadeOut("slow",function(){
        this.remove();
    });
});

// todo編集
// 自動でフォーカス＆全選択
// Enterを2回押した場合、またはshift+enterを押した場合、focusを外す
// focusが外れたら入力を決定し、spanにも反映される
$(document).on("click", ".js-todo_list-text", function(){
    $(this).hide().siblings(".js-todo_list-editArea").show().focus();
});
$(document).on("focus", ".js-todo_list-editArea", function(){
    $(this).select();
});

var keydownCode = 0;
$(document).on("keydown", ".js-todo_list-editArea", function(e){
    keydownCode = e.which;
    // console.log(keydownCode);
});
$(document).on("keyup", ".js-todo_list-editArea", function(e){
    if(( 13 === keydownCode && e.which === keydownCode) || (e.keyCode === 13 && e.shiftKey === true )){
        $(this).blur();
    }
});
$(document).on("blur", ".js-todo_list-editArea", function(e){
    const $this = $(this);
    const todoText = $this.siblings(".js-todo_list-text").text();
    // console.log("todoText : " + todoText);
    if(!$this.val()){
      $this.val(todoText);
    }
    $this
      .hide()
      .siblings(".js-todo_list-text")
      .text($this.val())
      .show()
      .closest(".js-list_item").attr('data-text', $this.val());
});


// 検索
// data属性を使って絞り込む
$(".js-search").on("keyup", function(e){
    const searchText = $(this).val();
    // console.log('searchText : ' + searchText);

    $(".js-list_item").show().each(function(index, element){
        const text = $(element).data('text');
        const regExp = new RegExp('^' + searchText);
        // console.log('text : ' + text);

        if( text && text.match(regExp) ){
            return true;
        }
        $(element).hide();
    });
});
});
