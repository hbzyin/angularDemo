<?php
/**分页查询数据**/
header('Content-Type:application/json');
$output = [];
$user_name = $_REQUEST['name'];
$sex = $_REQUEST['sex'];
$phone = $_REQUEST['phone'];
$addr = $_REQUEST['addr'];
$did = $_REQUEST['did'];
$order_time = time()*1000;   //PHP中的time()函数返回当前系统时间对应的整数值

if(empty($phone) || empty($user_name) || empty($sex) || empty($addr) || empty($did) ){
    echo "系统繁忙，请重新下单..."; //若客户端提交信息不足，则返回一个空数组，
    return;    //并退出当前页面的执行
}


$arr = [];
if($result){    //INSERT语句执行成功
    $arr['msg'] = 'succ';
    $arr['did'] = mysqli_insert_id($conn); //获取最近执行的一条INSERT语句生成的自增主键
}else{          //INSERT语句执行失败
    $arr['msg'] = 'err';
    $arr['reason'] = "SQL语句执行失败：$sql";
}
$output[] = $arr;



echo json_encode($output);
?>