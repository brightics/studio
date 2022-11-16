$.ajaxSetup({
  beforeSend: function (xhr, settings) {
      if (settings && settings.blocking) {
          var dim = {
              open: function (xhr, settings) {
                  this.$el = $('<div class="brtc-dim"><div class="brtc-dim-text brtc-style-appear-1sendond"><i class="fa fa-spinner fa-pulse fa-5x fa-fw"></i></div></div>');
                  $('body').append(this.$el);
              },
              close: function (data, textStatus, xhr) {
                  this.$el.remove();
              }
          };
          dim.open();
          xhr.done(dim.close.bind(dim));
          xhr.fail(dim.close.bind(dim));
      }
  },
  error: function (x, status, error) {
      var messages = {
          'errors': [
              {
                  'message': 'Sorry! An unexpected error occurred. Please contact administrator.',
                  'code': 400,
                  'contentType': x.getResponseHeader('Content-Type')
              }
          ]
      };
      if (x.status == 401) {
          $(window).unbind('beforeunload');
          // The session has expired and now you are taken to the login page.
          messages = {
              'errors': [
                  {
                      'message': 'The session has expired and the last operation was not applied. Please login again to continue.',
                      'code': 401
                  }
              ]
          };
          Brightics.VA.Core.Utils.WidgetUtils.openErrorDialog(messages, function () {
              window.location.href = "/";
          });
      } else if (x.status === 403) {
          messages.errors[0].code = 403;
          if (x.responseJSON && x.responseJSON.errors) {
              messages = x.responseJSON;
              messages.errors[0].contentType = x.getResponseHeader('Content-Type');
          } else {
              messages.errors[0].message = 'Maximum file length exceeded.'
              messages.errors[0].detailMessage = x.responseText;
          }

          Brightics.VA.Core.Utils.WidgetUtils.openErrorDialog(messages);
      } else if (x.status !== 400) {
          messages.errors[0].code = x.status;
          if (x.responseJSON && x.responseJSON.errors) {
              messages = x.responseJSON;
              messages.errors[0].contentType = x.getResponseHeader('Content-Type');
          } else if (x.responseText) {
              messages.errors[0].detailMessage = x.responseText;
          }

          Brightics.VA.Core.Utils.WidgetUtils.openErrorDialog(messages);
      }
  }
});