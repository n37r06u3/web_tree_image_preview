odoo.define('web.tree_image_preview', function (require) {
    "use strict";
    var core = require('web.core');
    var session = require('web.session');
    var ListView = require('web.ListView');
    var QWeb = core.qweb;
    var list_widget_registry = core.list_widget_registry;
    var WebTreeImagePreview = list_widget_registry.get('field.binary').extend({
        format: function (row_data, options) {
            if (!row_data[this.id] || !row_data[this.id].value) {
                return '';
            }
            var value = row_data[this.id].value, src;
            if (this.type === 'binary') {
                if (value && value.substr(0, 10).indexOf(' ') === -1) {
                    src = "data:image/png;base64," + value;
                } else {
                    var imageArgs = {
                        model: options.model,
                        field: this.id,
                        id: options.id
                    }
                    if (this.resize) {
                        imageArgs.resize = this.resize;
                    }
                    src = session.url('/web/binary/image', imageArgs);
                }
            } else {
                if (!/\//.test(row_data[this.id].value)) {
                    src = '/web/static/src/img/icons/' + row_data[this.id].value + '.png';
                } else {
                    src = row_data[this.id].value;
                }
            }
            return QWeb.render('ListView.row.image.preview', {widget: this, src: src});
        }
    });

    ListView.List.include({
        render: function () {
            var result = this._super(this, arguments)
            this.$current.delegate('img.web_tree_image_preview',
                'click', function () {
                    var image_href = $(this).attr('src');
                    var tree_image_preview_box = $('#tree_image_preview_box')
                    if (tree_image_preview_box.length > 0) {
                        $('#content').html('<img src="' + image_href + '" />');
                        tree_image_preview_box.show();
                    }
                    else {
                        var lightbox =
                            '<div id="tree_image_preview_box" onclick="this.style.display = \'none\';">' +
                            '<div id="content">' +
                            '<img src="' + image_href + '" />' +
                            '</div>' +
                            '</div>';
                        $('body').append(lightbox);
                    }
                    return false;
                });
            return result;
        },
    });


    list_widget_registry.add('field.image-preview', WebTreeImagePreview)
});
