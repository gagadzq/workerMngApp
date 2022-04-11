import Toast from 'react-native-root-toast';

export default function ToastNative(mes) {
    let toast = Toast.show(mes, {
        duration: Toast.durations.LONG, // toast显示时长
        position: Toast.positions.CENTER, // toast位置
        shadow: true, // toast是否出现阴影
        animation: true, // toast显示/隐藏的时候是否需要使用动画过渡
        hideOnPress: true, // 是否可以通过点击事件对toast进行隐藏
        delay: 0, // toast显示的延时
        
    });
    // 也可以通过调用Toast.hide(toast); 手动隐藏toast实例
    setTimeout(function () {
        Toast.hide(toast);
    }, 1000);
}