let alertDialog = null ;
export default function createAlertDialog(params) {    
    alertDialog = null;
    let AlertDialog = plus.android.importClass('android.app.AlertDialog');
    let dlg = new AlertDialog.Builder(plus.android.runtimeMainActivity());
    // 设置提示框标题
    dlg.setTitle(params.title);
    // 设置提示框内容
    dlg.setMessage(params.message);
    // 设置提示框按钮
    let listenter = plus.android.implements('android.content.DialogInterface$OnClickListener', {
        'onClick':  (dialog,which) => {
            if (typeof params.callback === 'function') {
                params.callback();
            }
        }
    })
    dlg.setPositiveButton(params.confirm || '确定', listenter);
    // 显示提示框
    let WindowManager = plus.android.importClass('android.view.WindowManager');
    //let mLayout = new WindowManager.LayoutParams();
    alertDialog = dlg.create();
    alertDialog.setCanceledOnTouchOutside(false);
    plus.android.invoke(alertDialog.getWindow(),'setType',WindowManager.LayoutParams.TYPE_SYSTEM_ALERT);
    alertDialog.show();
}