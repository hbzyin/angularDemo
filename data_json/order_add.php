<?php
/**��ҳ��ѯ����**/
header('Content-Type:application/json');
$output = [];
$user_name = $_REQUEST['name'];
$sex = $_REQUEST['sex'];
$phone = $_REQUEST['phone'];
$addr = $_REQUEST['addr'];
$did = $_REQUEST['did'];
$order_time = time()*1000;   //PHP�е�time()�������ص�ǰϵͳʱ���Ӧ������ֵ

if(empty($phone) || empty($user_name) || empty($sex) || empty($addr) || empty($did) ){
    echo "ϵͳ��æ���������µ�..."; //���ͻ����ύ��Ϣ���㣬�򷵻�һ�������飬
    return;    //���˳���ǰҳ���ִ��
}


$arr = [];
if($result){    //INSERT���ִ�гɹ�
    $arr['msg'] = 'succ';
    $arr['did'] = mysqli_insert_id($conn); //��ȡ���ִ�е�һ��INSERT������ɵ���������
}else{          //INSERT���ִ��ʧ��
    $arr['msg'] = 'err';
    $arr['reason'] = "SQL���ִ��ʧ�ܣ�$sql";
}
$output[] = $arr;



echo json_encode($output);
?>