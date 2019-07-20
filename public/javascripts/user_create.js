const PAGE = {
    init:function(){
        this.bind();
    },
    bind:function(){
        $('#userSubmit').bind('click',this.handleSubmit);
    },
    handleSubmit:(()=>{
        let name = $('#userName').val();
        let phone = $('#userPhone').val();
        let password = $('#userPassword').val();
        let role = $('#userRole').val();

        if (!name || !phone || !password) {
            alert('缺少参数')
            return 
        }

        $.ajax({
            url:'/api/user',
            data:{name,phone,password,role},
            type:'POST',
            beforeSend:function(){
                $('#userSubmit').attr('disabled',true);
            },
            success:((data)=>{
                if(data.code === 200){
                    alert('添加成功')
                    window.open('/admin/user')
                    // location.href = '/admin/user'
                }else{
                    alert(data.message)
                }
            }),
            error:((err)=>{
                console.log(err)
            }),
            complete:(()=>{
                $('#userSubmit').attr('disabled',false);
            })
        })
        
    })
};

PAGE.init();
