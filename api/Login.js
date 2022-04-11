const api = axios.create({
    baseURL: 'http://54.232.86.157:8000'
})


const refresh = async () =>{
    try {
        const value = localStorage.getItem('TOKEN')
        const {data} = await api.post('/refresh',{
            headers:{
                'Authorization' : 'Bearer ' + value
            }
        })
        
            
        localStorage.setItem('TOKEN',data.access)
        localStorage.setItem('REFRESH_TOKEN',data.refresh)
        console.log('deu certo')
    } catch ($e) {
        console.log('Erro' + $e)
    }
    
} 




const login = async (nome, senha) => {
    try{

        if(document.getElementById('nome').value == ''){
            alert('Por favor preencha seu nome!')
            return false
        }

        if(document.getElementById('senha').value == ''){
            alert('Por favor preencha a senha!')
            return false
        }
        
        // console.log(dados)
        const {data} = await api.post('/login', {
            "username": nome,
            "password": senha
        })
        console.log(data)

        localStorage.setItem('TOKEN',data.access)
        localStorage.setItem('REFRESH_TOKEN',data.refresh)

        sessionStorage.setItem('usuarioLogado' , 'true')

        location.href='dashboard.html'

    }catch($e){
        if($e.response.status == 401){
            alert('Login Inválido')
        }
    }
}
