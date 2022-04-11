const api = axios.create({
    baseURL: 'http://54.232.86.157:9000'
})

const api2 = axios.create({
    baseURL: 'http://54.232.86.157:8000'
})
var table

var renew = false;
const refresh = async () =>{
    try {
        const value = localStorage.getItem('REFRESH_TOKEN')
        const {data} = await api2.get('/refresh',{
            headers:{
                'Authorization' : 'Bearer ' + value
            }
        })
 
        localStorage.setItem('TOKEN',data.access)
        localStorage.setItem('REFRESH_TOKEN',data.access)
        renew = true
        console.log('CERTO')
    } catch ($e) {
        console.log('ERRADO')
        console.log('Erro ' + $e)
        renew = false
    }
    
} 



const Dados = async = (paginas,ncm,ean,desc,data) =>{

    let date = data
    let dateBR = date.split('-').reverse().join('/')
    // console.log(dateBR)
    let url = `retorno=${paginas}`

    if (ean != ''){
     url = url + `&ean=${ean}` 
    } 
    
    if (ncm != ''){
        url = url + `&ncm=${ncm}` 
    } 

    if (desc != ''){
        url = url + `&descricao=${desc}` 
    } 

    if (data != ''){
        url = url + `&data=${dateBR}` 
    }

    // if(document.getElementById('ncm').value == ''){
    //     alert('O NCM não pode ser vazio!!')
    // }
   
    try{
        const value = localStorage.getItem('TOKEN')
    //    console.log(value)
    //    descricao=${desc}&data=${dateBR}&ncm=${ncm}&
      //console.log(url)
       api.get(`/produtos?${url}`,{
           headers:{
               'Authorization' : 'Bearer ' + value
           }
       }).then(Response => {
            var info = Response.data.data
            //console.log(info)
            BuildTable(info)

            function BuildTable(data){
               
                table = document.getElementById('MyTable')
                table.innerHTML = ''
                for(var i = 0; i < data.length; i++){
                    //console.log(data)
                    var row = `<tr class="active-row" ondblclick='OpenVisu(${data[i].id})'>
                                    <td>${data[i].id}</td>
                                    <td>${data[i].descricao}</td>
                                    <td>${data[i].ean}</td>
                                    <td>${data[i].ncm}</td>
                                    <td class="aaa">
                                        <button class="btn btn-primary"  onclick="OpenVisu(${data[i].id})"><ion-icon name="create-outline" style="font-size: 24px; font-weight: bold"></ion-icon></button>
                                        <button class="btn btn-danger" onclick="excluir(${data[i].id})"><ion-icon name="trash-outline" style="font-size: 24px; font-weight: bold"></ion-icon></button>
                                    </td>
                                </tr>
                    
                            `
                    table.innerHTML += row
                    
                }
            }
            
                     
       }).catch((err) => {
           console.log(err.response.status)

           if(err.response.status == 401){
            refresh()
            setTimeout(() => {
                if(renew == false){
                    alert('Seu Token expirou, por favor faça login novamente!!')
                    location.href = 'login.html'
               }else{
                    console.log('RODOU O TOKEN NOVO')
                   Dados(paginas,ncm,ean,desc,data)
               }   
            },2000)

           if(err.response.status == 404){
               alert('Informações não encontradas!!')
           }
        }})
    }catch ($e){
      console.log($e)
    }
}

const BuscaOne = async = (codigo) =>{
    try{
        const value = localStorage.getItem('TOKEN')
        api.get(`/produtos/${codigo}`,{
            headers:{
                'Authorization' : 'Bearer ' + value
            }
        }).then(Response => {
            var dado = Response.data
            console.log(dado)
            teste(dado);
            function teste(data){
                console.log(data.baseIcms)
                document.getElementById('IDProduto').value = data.id
                document.getElementById('Descri').value = data.descricao;
                document.getElementById('Ean').value = data.ean;
                document.getElementById('Ncm').value = data.ncm;
                document.getElementById('ncmEx').value = data.ncmEx;
                document.getElementById('Cest').value = data.cest;
                document.getElementById('csticms').value = data.cstIcms;
                document.getElementById('Cbenef').value = data.cbenef;
                document.getElementById('csosn').value = data.csosn;
                document.getElementById('aliqIcms').value = data.aliqIcms;
                document.getElementById('mvainterna').value = data.mvaInterna;
                document.getElementById('mvaajustada').value = data.mvaAjustada;
                document.getElementById('CstPisCofinsEntrada').value = data.cstPisCofinsEntrada;
                document.getElementById('tipocredito').value = data.tipoCredito;
                document.getElementById('CstPisCofinsSaida').value = data.cstPisCofinsSaida;
                document.getElementById('naturezaReceita').value = data.naturezaReceita;
                document.getElementById('AliqPisCumulativo').value = data.aliqPisCumulativo;
                document.getElementById('AliqCofinsCumulativo').value = data.aliqCofinsCumulativo;
                document.getElementById('AliqPisNaoCumulativo').value = data.aliqCofinsNaoCumulativo;
                document.getElementById('AliqCofinsNaoCumulativo').value = data.aliqCofinsNaoCumulativo;
                document.getElementById('baseicms1').value = data.baseIcms;
                document.getElementById('baseicmsST').value = data.baseIcmsSt;
                document.getElementById('aliqismsST').value = data.aliqIcmsSt;
            }
            
        }).catch((err) =>{
            if(err.response.status == 401){
                refresh()
                setTimeout(() => {
                    if(renew == false){
                        alert('Seu Token expirou, por favor faça login novamente!!')
                        location.href = 'login.html'
                   }else{
                        console.log('RODOU O TOKEN NOVO')
                       BuscaOne(codigo)
                   }   
                },2000)
    
               if(err.response.status == 404){
                   alert('Informações não encontradas!!')
               }
            }})
    }catch($e){
       console.log($e)
    }
}

const Register = async = (IDProduto,descri, Ean,Ncm,ncmEx,Cest,csticms,Cbenef,csosn,aliqIcms,mvainterna,mvaajustada,CstPisCofinsEntrada,tipocredito,CstPisCofinsSaida,naturezaReceita,AliqPisCumulativo,AliqCofinsCumulativo,AliqPisNaoCumulativo,AliqCofinsNaoCumulativo,baseicms1,baseicmsST,aliqismsST) =>{
        console.log(IDProduto)
    try {

        if(Ncm.length > 8 || Ncm.length < 8){
            alert('É necessário ter 8 caracteres para ser válido.')
            return false
        }

        if(ncmEx.length > 2){
            alert('Só é permitido no máximo 2 caracteres')
            return false
        }

        if(Cest.length > 7){
            alert('Só é permitido no máximo 7 caracteres')
        }

        if(Cbenef.length > 8){
            alert('Só é permitido no máximo 8 caracteres')
        }
      
        const value = localStorage.getItem('TOKEN')
        const headers = {
            'Authorization' : 'Bearer ' + value
        }

        if(IDProduto == '' || null){
            api.post('/produtos', {
                "descricao": descri,
                "ncm": Ncm,
                "ean" : Ean,
                "ncmEx": ncmEx,
                "cest": Cest,
                "cstIcms": csticms,
                "cbenef": Cbenef,
                "csosn": csosn,
                "aliqIcms": aliqIcms,
                "mvaInterna": mvainterna,
                "mvaAjustada" : mvaajustada,
                "baseIcmsSt": baseicmsST,
                "aliqIcmsSt" : aliqismsST,
                "cstPisCofinsEntrada" : CstPisCofinsEntrada,
                "tipoCredito" : tipocredito,
                "cstPisCofinsSaida" : CstPisCofinsSaida,
                "naturezaReceita" : naturezaReceita,
                "aliqPisCumulativo" : AliqPisCumulativo,
                "aliqCofinsCumulativo" : AliqCofinsCumulativo,
                "aliqPisNaoCumulativo" : AliqPisNaoCumulativo,
                "aliqCofinsNaoCumulativo" : AliqCofinsNaoCumulativo,
                "baseicms" : baseicms1,
            }, {headers: headers}).then((Response) => {
                alert('Produto cadastrado com sucesso!!')
                console.log(Response)
            }).catch((err) => {
                console.log(err)
            })
        }else{
            api.put(`/produtos/${IDProduto}`, {
                "descricao": descri,
                "ean" : Ean,
                "ncm": Ncm,
                "ncmEx": ncmEx,
                "cest": Cest,
                "cstIcms": csticms,
                "cbenef": Cbenef,
                "csosn": csosn,
                "aliqIcms": aliqIcms,
                "mvaInterna": mvainterna,
                "mvaAjustada" : mvaajustada,
                "aliqIcmsSt" : aliqismsST,
                "baseIcmsSt": baseicmsST,
                "cstPisCofinsEntrada" : CstPisCofinsEntrada,
                "tipoCredito" : tipocredito,
                "cstPisCofinsSaida" : CstPisCofinsSaida,
                "naturezaReceita" : naturezaReceita,
                "aliqPisCumulativo" : AliqPisCumulativo,
                "aliqCofinsCumulativo" : AliqCofinsCumulativo,
                "aliqPisNaoCumulativo" : AliqPisNaoCumulativo,
                "aliqCofinsNaoCumulativo" : AliqCofinsNaoCumulativo,
                "baseicms" : baseicms1
            }, {headers: headers}).then((Response) => {
                alert('Produto Atualizado com sucesso!!')
                console.log(Response)
            }).catch((err) => {
                console.log(err)
            })
        }
        
    
    }catch($e){
        console.log($e)
    }
}

const excluir = async = (codigo) =>{
    try {
        if(confirm(`Tem certeza que deseja excluir o produto com o ID ${codigo}`)){
            const value = localStorage.getItem('TOKEN')
            api.delete(`/produtos/${codigo}`, {
                headers:{
                    'Authorization' : 'Bearer ' + value
                }
            }).then((Response) => {
                alert('Dado excluido com sucesso!!')
                location.reload()
            })
        }else{
            return false
        }
    } catch ($e) {
        console.log($e)
    }
}