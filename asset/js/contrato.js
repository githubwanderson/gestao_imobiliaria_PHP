/**
 * Responsavel por buscar lista de Locador
 */
function getLocatario()
{
    dados = [];
    dados[0]   = "cliente"
    dados[1]   = "cliente.ATIVO = 1 AND cliente.TIPO = 2"; // TIPO = 2 LOCATARIO
    dados[2]   = null;
    dados[3]   = null;
    dados[4]   = null;
    dados[5]   = "cliente.ID , cliente.NOME";

    // Verificar se ha registro no banco
    $.ajax(
    {
        url:'ajax/tabela.php',
        type:'post',
        dataType:'json',
        data:{dados},
        success:(dados)=>
        {
            if(dados.length > 0)
            {
                preenchaSelect('ID_CLIENTE',dados)
            }
            else
            {                         
                console.log('Sem dados de cliente "LOCATARIO"');
            }
        },
        error:(e)=>
        {
            console.log(e.status, e.statusText);
        }   
    });
}

/**
 * Responsavel por buscar lista de imoveis join proprietarios
 */
function getImovel()
{
    dados = [];
    dados[0]   = "imovel"
    dados[1]   = "imovel.ATIVO = 1"; 
    dados[2]   = "cliente b ON b.ID = imovel.ID_CLIENTE";
    dados[3]   = null;
    dados[4]   = null;
    dados[5]   = "imovel.ID , CONCAT( b.NOME , ' | ' , imovel.ENDERECO ) NOME";

    $.ajax(
    {
        url:'ajax/tabela.php',
        type:'post',
        dataType:'json',
        data:{dados},
        success:(dados)=>
        {
            if(dados.length > 0)
            {
                preenchaSelect('ID_IMOVEL',dados)
            }
            else
            {                         
                console.log('Sem dados de IMOVEL');
            }
        },
        error:(e)=>
        {
            console.log(e.status, e.statusText);
        }   
    });
}

/**
 * Responsavel por buscar lista de imoveis join proprietarios
 */
function getTaxaAdm()
{
    dados = [];
    dados[0]   = "AdmTaxa";
    dados[1]   = "services"; 
    dados[2]   = "getValor"; 

    $.ajax(
    {
        url:'ajax/class.php',
        type:'post',
        dataType:'json',
        data:{dados},
        success:(dados)=>
        {
            if(dados.length > 0)
            {
                $('#VALOR_TX_ADM').val(dados)
            }
            else
            {                         
                console.log('Sem dados da taxa da ADM');
            }
        },
        error:(e)=>
        {
            console.log(e.status, e.statusText);
        }   
    });
}


/**
 * Responsavel por Salvar o formulario
 */
$('#btnSubmit').click(function()
{
    if(!validaForm())
    {
        alert('Digite um valor válido.')
    }
    else
    {   
        dados = $('#form').serialize();
        dados = dados + "&CL=Contrato";
        
        $.ajax(
        {
            url:'ajax/salvar.php',
            type:'post',
            dataType:'json',
            data: dados,
            success:(dados)=>
            {
                $('#form input').each(function() {
                    $(this).val(''); 
                });

                getTable();

                $('.modal').modal('hide');

                alert('Registro ID:'+dados+' salvo com sucesso.');
            },
            error:(e)=>
            {
                console.log('Error: ' + e.status, e.statusText);
            }        
        });
    }
}); 

/**
 * Responsavel por preencher select do modal
 */
function preenchaSelect(idSelect,array)
{
    $.each(array, function( n , v )
    {
        document.getElementById(idSelect).innerHTML += '<option value='+v.ID+'>'+v.NOME+'</option>';
    });
}

/**
 * Responsavel por validar o form
 * @return bollean
 */
function validaForm(){

    switch (true) {

        case $('input[name=ID_CLIENTE]').val()=='':
            return false;
            break;

        case $('input[name=ID_IMOVEL]').val()=='':
            return false;
            break;

        case $('input[name=DURACAO_MES]').val()=='':
            return false;
            break;

        case $('input[name=DT_INICIO]').val()=='':
            return false;
            break;
        
        case $('input[name=VALOR_ALUGUEL]').val()=='':
            return false;
            break;

        case $('input[name=VALOR_CONDOMINIO]').val()=='':
            return false;
            break;
        
        case $('input[name=VALOR_IPTU]').val()=='':
            return false;
            break;

        case $('input[name=VALOR_TX_ADM]').val()=='':
            return false;
            break;
    
        default:
            return true
            break;
    }
}

/**
 * Responsavel por buscar lista de Locatario e preencher tabela
 * @param array 
 */
function getTable()
{
    dados = [];
    dados[0]   = "contrato"
    dados[1]   = "contrato.ATIVO = 1"; 
    dados[2]   = "cliente b ON b.ID = contrato.ID_CLIENTE JOIN imovel c ON c.ID = contrato.ID_IMOVEL";
    dados[3]   = null;
    dados[4]   = null;
    dados[5]   = "contrato.ID , b.NOME , c.ENDERECO ,  DATE_FORMAT( contrato.DT_INICIO, '%d/%m/%Y' ) DT_INICIO , DATE_FORMAT( contrato.DT_FIM, '%d/%m/%Y' ) DT_FIM";

    // Verificar se ha registro no banco
    $.ajax(
    {
        url:'ajax/tabela.php',
        type:'post',
        dataType:'json',
        data:{dados},
        success:(dados)=>
        {
            if(dados.length > 0)
            {
                preenchaTabela(dados)
            }
            else
            {                         
                $('#tbody').html('<tr><td colspan="8">Não encontrado registros para tabela.</td></tr>');
            }
        },
        error:(e)=>
        {
            console.log(e.status, e.statusText);
        }   
    });
}

function preenchaTabela(dados)
{
    $('#tbody').html('');

    line = 0
    body = false;
    $.each(dados, function(i,v)
    {           
        link_editar         = "<a id="+v.ID+" class='btn btn_edit'><i class='fa fa-edit' aria-hidden='true'></i></a>";
        link_repasse        = "<a id="+v.ID+" class='btn btn_edit' data-toggle='modal' data-target='#modalParcela' onclick='repasse("+v.ID+")'><i class='fa fa-table' aria-hidden='true'></i></a>";
        link_mensalidade    = "<a id="+v.ID+" class='btn btn_edit' data-toggle='modal' data-target='#modalParcela' onclick='mensalidade("+v.ID+")'><i class='fa fa-table' aria-hidden='true'></i></a>";

        if(line=0)
        {
            line = '<tr><td>'+v.ID+'</td>'+'<td>'+v.NOME+'</td>'+'<td>'+v.ENDERECO+'</td>'+'<td>'+v.DT_INICIO+'</td>'+'<td>'+v.DT_FIM+'</td>'+'<td>'+link_mensalidade+'</td>'+'<td>'+link_repasse+'</td>'+'<td>'+link_editar+'</td>';    
            line + '</tr>';  
        }
        else
        {
            line = line + '<tr><td>'+v.ID+'</td>'+'<td>'+v.NOME+'</td>'+'<td>'+v.ENDERECO+'</td>'+'<td>'+v.DT_INICIO+'</td>'+'<td>'+v.DT_FIM+'</td>'+'<td>'+link_mensalidade+'</td>'+'<td>'+link_repasse+'</td>'+'<td>'+link_editar+'</td>';    
            line + '</tr>';  
        }  
        body = body == false ? line : body + line;
    });   
        
    $('#tbody').html(body);
}

/**
 * Responsavel por direcionar o update do status mensalidade
 * @param {integer} id 
 */
function mensalidade( id ){

    // Regra banco de dados: PARCELA_TIPO : 1=MENSALIDADE , 2=REPASSE
    tipo = 1;

    // preencher titulo modal
    $('#modalParcelaTilulo').html('PARCELA - Mensalidade');

    // preencher titulo table modal
    theadParcela = '<tr><th>PARCELA</th><th>VALOR (R$)</th><th>VENCIMENTO</th><th>REALIZADO</th></tr>'
    $('#theadParcela').html(theadParcela);

    parcelaSearch( id , tipo );
    
}

/**
 * Responsavel por direcionar o update do status repasse
 * @param {integer} id 
 */
function repasse( id ){

    // Regra banco de dados: PARCELA_TIPO : 1=MENSALIDADE , 2=REPASSE
    tipo = 2;

    // preencher titulo modal
    $('#modalParcelaTilulo').html('PARCELA - Repasse');

    // preencher titulo table modal
    theadParcela = '<tr><th>PARCELA</th><th>VALOR (R$)</th><th>VENCIMENTO</th><th>REALIZADO</th></tr>'
    $('#theadParcela').html(theadParcela);

    parcelaSearch( id , tipo );    
}

/**
 * Responsavel por carregar a modal com dados da parcela
 */
function parcelaSearch( id , tipo ){
    
    // pegar dados
    // preencher tabela modal

    dados = [];
    dados[0]   = "contrato_parcela"
    dados[1]   = "contrato_parcela.ID_CONTRATO =" + id + " AND contrato_parcela.TIPO = " + tipo; 
    dados[2]   = null;
    dados[3]   = null;
    dados[4]   = null;
    dados[5]   = "contrato_parcela.ID , contrato_parcela.PARCELA , contrato_parcela.VALOR , DATE_FORMAT( contrato_parcela.DT_VENCIMENTO, '%d/%m/%Y' ) DT_VENCIMENTO , contrato_parcela.REALIZADO";

    // Verificar se ha registro no banco
    $.ajax(
    {
        url:'ajax/tabela.php',
        type:'post',
        dataType:'json',
        data:{dados},
        success:(dados)=>
        {
            if(dados.length > 0)
            {
                preenchaTabelaParcela(dados)
            }
            else
            {                         
                $('#tbodyParcela').html('<tr><td colspan="8">Não encontrado registros para tabela.</td></tr>');
            }
        },
        error:(e)=>
        {
            console.log(e.status, e.statusText);
        }   
    });
}

function preenchaTabelaParcela( dados )
{
    $('#tbodyParcela').html('');

    body = false;
    $.each(dados, function(i,v)
    {         
        realizadoStatus = v.REALIZADO == 1 ? 'off' : 'on'; 
        btnStatus = 
            '<button type="button" id="par_'+v.ID+'" class="btn btn-dark" onclick="parcelaEditar('+v.ID+')">'
            +'<span class="text-white" aria-hidden="true"><i class="fa fa-toggle-'+realizadoStatus+'" aria-hidden="true"></i></span>'
            +'</button>';

        line = '<tr><td>'+v.PARCELA+'</td>'+'<td>'+v.VALOR+'</td>'+'<td>'+v.DT_VENCIMENTO+'</td>'+'<td>'+btnStatus+'</td></tr>';    
   
        body = body == false ? line : body + line;
    });   
        
    $('#tbodyParcela').html(body);
}

/**
 * Responsavel por alterar o status de uma parcela
 * @param {integer} id 
 * Regra banco de dados: REALIZADO: 1=sim , 2=nao
 * Atribuido as parcelas como 1=on e 2=off
 */
function parcelaEditar( id ){

    btnClass  = $('#par_'+id).children().children().prop('class');

    if(btnClass == 'fa fa-toggle-off')
    {
        updateStatusParcela( id , 2 )
        /**
         * Se class = off entao alterar status para on e salvar 1 no banco de dados
         */
        $('#par_'+id).children().children().prop('class','fa fa-toggle-on');
    }
    else
    {
        updateStatusParcela( id , 1 )
        /**
         * Se class = on entao alterar status para off e salvar 2 no banco de dados
         */
        $('#par_'+id).children().children().prop('class','fa fa-toggle-off');
    }
}

/**
 * Responsavel por salvar status da parcela
 * @param {integer} id 
 */
function updateStatusParcela( id , valor ){

    dados = "ID="+id;
    dados += "&REALIZADO="+valor;
    dados += "&CL=services/Parcela";
    
    $.ajax(
    {
        url:'ajax/update.php',
        type:'post',
        dataType:'json',
        data: dados,
        success:(dados)=>
        {
            return dados;
        },
        error:(e)=>
        {
            console.log('Error: ' + e.status, e.statusText);
        }        
    })   
}

getLocatario();
getImovel();
getTaxaAdm();
getTable();
 