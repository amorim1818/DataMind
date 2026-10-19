import pandas as pd
import sys
import json
import os
import math
import unicodedata
import re


# ============================================================
# FUNÇÕES AUXILIARES
# ============================================================

def converter_valor(valor):

    if pd.isna(valor):
        return None

    if isinstance(valor, (int, float)):

        if isinstance(valor, float) and (
            math.isnan(valor) or
            math.isinf(valor)
        ):
            return None

        return float(valor)

    return str(valor)


def normalizar_texto(texto):

    texto = str(texto).lower()

    texto = unicodedata.normalize(
        "NFD",
        texto
    )

    texto = "".join(
        caractere
        for caractere in texto
        if unicodedata.category(caractere) != "Mn"
    )

    texto = re.sub(
        r"[^a-z0-9]+",
        "_",
        texto
    )

    return texto.strip("_")


def encontrar_coluna(
    colunas,
    palavras
):

    for coluna in colunas:

        coluna_normalizada = normalizar_texto(coluna)

        for palavra in palavras:

            palavra_normalizada = normalizar_texto(palavra)

            if palavra_normalizada in coluna_normalizada:
                return coluna

    return None


def calcular_estatisticas_coluna(
    dados,
    coluna
):

    if not coluna:
        return None

    if coluna not in dados.columns:
        return None

    serie = pd.to_numeric(
            dados[coluna],
            errors="coerce"
        ).dropna()

    if len(serie) == 0:
        return None

    return {

        "soma":
            round(
                float(serie.sum()),
                2
            ),

        "media":
            round(
                float(serie.mean()),
                2
            ),

        "minimo":
            round(
                float(serie.min()),
                2
            ),

        "maximo":
            round(
                float(serie.max()),
                2
            ),

        "mediana":
            round(
                float(serie.median()),
                2
            )

    }


# ============================================================
# ANÁLISE DE RH
# ============================================================

def analisar_rh(dados):

    colunas = list(dados.columns)

    coluna_salario = encontrar_coluna(
            colunas,
            [
                "salario",
                "salario mensal",
                "remuneracao",
                "remuneracao mensal"
            ]
        )

    coluna_idade = encontrar_coluna(
            colunas,
            [
                "idade"
            ]
        )

    coluna_cargo = encontrar_coluna(
            colunas,
            [
                "cargo",
                "funcao",
                "profissao"
            ]
        )

    coluna_funcionario = encontrar_coluna(
            colunas,
            [
                "funcionario",
                "colaborador",
                "nome"
            ]
        )

    resultado = {

        "setor":
            "rh",

        "colunas_identificadas": {

            "salario":
                coluna_salario,

            "idade":
                coluna_idade,

            "cargo":
                coluna_cargo,

            "funcionario":
                coluna_funcionario

        },

        "indicadores": {}

    }


    if coluna_salario:

        estatisticas = calcular_estatisticas_coluna(
                dados,
                coluna_salario
            )

        if estatisticas:

            resultado["indicadores"][
                "salario"
            ] = estatisticas


    if coluna_idade:

        estatisticas = calcular_estatisticas_coluna(
                dados,
                coluna_idade
            )

        if estatisticas:

            resultado["indicadores"][
                "idade"
            ] = estatisticas


    if coluna_cargo:

        distribuicao = dados[coluna_cargo] \
                .fillna("Não informado") \
                .astype(str) \
                .value_counts() \
                .head(10) \
                .to_dict()

        resultado["indicadores"][
            "cargos"
        ] = distribuicao


    return resultado


# ============================================================
# ANÁLISE FINANCEIRA
# ============================================================

def analisar_financeiro(dados):

    colunas = list(dados.columns)

    coluna_receita = encontrar_coluna(
            colunas,
            [
                "receita",
                "faturamento",
                "entrada",
                "recebimento"
            ]
        )

    coluna_despesa = encontrar_coluna(
            colunas,
            [
                "despesa",
                "gasto",
                "saida",
                "pagamento"
            ]
        )

    coluna_custo = encontrar_coluna(
            colunas,
            [
                "custo",
                "custos"
            ]
        )

    coluna_lucro = encontrar_coluna(
            colunas,
            [
                "lucro",
                "resultado",
                "lucro liquido"
            ]
        )

    resultado = {

        "setor":
            "financeiro",

        "colunas_identificadas": {

            "receita":
                coluna_receita,

            "despesa":
                coluna_despesa,

            "custo":
                coluna_custo,

            "lucro":
                coluna_lucro

        },

        "indicadores": {}

    }


    colunas_financeiras = {

        "receita":
            coluna_receita,

        "despesa":
            coluna_despesa,

        "custo":
            coluna_custo,

        "lucro":
            coluna_lucro

    }


    for nome, coluna in colunas_financeiras.items():

        if coluna:

            estatisticas = calcular_estatisticas_coluna(
                    dados,
                    coluna
                )

            if estatisticas:

                resultado["indicadores"][
                    nome
                ] = estatisticas


    return resultado


# ============================================================
# ANÁLISE COMERCIAL
# ============================================================

def analisar_comercial(dados):

    colunas = list(dados.columns)

    coluna_vendas = encontrar_coluna(
            colunas,
            [
                "venda",
                "vendas",
                "quantidade vendida"
            ]
        )

    coluna_faturamento = encontrar_coluna(
            colunas,
            [
                "faturamento",
                "receita",
                "valor venda",
                "valor total",
                "total"
            ]
        )

    coluna_produto = encontrar_coluna(
            colunas,
            [
                "produto",
                "item"
            ]
        )

    coluna_vendedor = encontrar_coluna(
            colunas,
            [
                "vendedor",
                "consultor",
                "representante"
            ]
        )

    coluna_cliente = encontrar_coluna(
            colunas,
            [
                "cliente",
                "comprador"
            ]
        )

    resultado = {

        "setor":
            "comercial",

        "colunas_identificadas": {

            "vendas":
                coluna_vendas,

            "faturamento":
                coluna_faturamento,

            "produto":
                coluna_produto,

            "vendedor":
                coluna_vendedor,

            "cliente":
                coluna_cliente

        },

        "indicadores": {}

    }


    if coluna_vendas:

        estatisticas = calcular_estatisticas_coluna(
                dados,
                coluna_vendas
            )

        if estatisticas:

            resultado["indicadores"][
                "vendas"
            ] = estatisticas


    if coluna_faturamento:

        estatisticas = calcular_estatisticas_coluna(
                dados,
                coluna_faturamento
            )

        if estatisticas:

            resultado["indicadores"][
                "faturamento"
            ] = estatisticas


    if coluna_produto:

        produtos = dados[coluna_produto] \
                .fillna("Não informado") \
                .astype(str) \
                .value_counts() \
                .head(10) \
                .to_dict()

        resultado["indicadores"][
            "produtos"
        ] = produtos


    if coluna_vendedor:

        vendedores = dados[coluna_vendedor] \
                .fillna("Não informado") \
                .astype(str) \
                .value_counts() \
                .head(10) \
                .to_dict()

        resultado["indicadores"][
            "vendedores"
        ] = vendedores


    if coluna_cliente:

        clientes_unicos = int(
                dados[coluna_cliente]
                .dropna()
                .astype(str)
                .nunique()
            )

        resultado["indicadores"][
            "clientes_unicos"
        ] = clientes_unicos


    return resultado


# ============================================================
# ANÁLISE PERSONALIZADA
# ============================================================

def analisar_personalizado(dados):

    colunas_numericas = dados.select_dtypes(
            include="number"
        ).columns.tolist()

    indicadores = {}

    for coluna in colunas_numericas:

        estatisticas = calcular_estatisticas_coluna(
                dados,
                coluna
            )

        if estatisticas:

            indicadores[str(coluna)] = estatisticas


    return {

        "setor":
            "personalizado",

        "colunas_identificadas":
            [
                str(coluna)
                for coluna in dados.columns
            ],

        "indicadores":
            indicadores

    }


# ============================================================
# FUNÇÃO PRINCIPAL
# ============================================================

def analisar_arquivo(
    arquivo,
    setor
):

    if not os.path.exists(arquivo):

        return {

            "sucesso": False,

            "erro":
                "Arquivo não encontrado"

        }


    try:

        extensao = os.path.splitext(
                arquivo
            )[1].lower()


        # ----------------------------------------
        # Leitura do arquivo
        # ----------------------------------------

        if extensao == ".xlsx":

            dados = pd.read_excel(
                    arquivo
                )

        elif extensao == ".csv":

            dados = pd.read_csv(
                    arquivo
                )

        elif extensao == ".xls":

            dados = pd.read_excel(
                    arquivo
                )

        else:

            return {

                "sucesso": False,

                "erro":
                    "Formato de arquivo não suportado"

            }


        # ----------------------------------------
        # Análise geral
        # ----------------------------------------

        valores_vazios = int(
                dados.isnull()
                .sum()
                .sum()
            )

        duplicados = int(
                dados.duplicated()
                .sum()
            )


        colunas_numericas = dados.select_dtypes(
                include="number"
            ).columns.tolist()


        colunas_texto = dados.select_dtypes(
                include="object"
            ).columns.tolist()


        estatisticas = {}


        for coluna in colunas_numericas:

            estatisticas[coluna] = calcular_estatisticas_coluna(
                    dados,
                    coluna
                )


        # ----------------------------------------
        # Análise específica do setor
        # ----------------------------------------

        if setor == "rh":

            analise_setor = analisar_rh(
                    dados
                )

        elif setor == "financeiro":

            analise_setor = analisar_financeiro(
                    dados
                )

        elif setor == "comercial":

            analise_setor = analisar_comercial(
                    dados
                )

        else:

            analise_setor = analisar_personalizado(
                    dados
                )


        # ----------------------------------------
        # Dados para o dashboard
        # ----------------------------------------

        dados_planilha = []


        for _, linha in dados.iterrows():

            registro = {}


            for coluna in dados.columns:

                registro[str(coluna)] = converter_valor(
                        linha[coluna]
                    )


            dados_planilha.append(
                registro
            )


        # Limita a 500 linhas

        dados_dashboard = dados_planilha[:500]


        # ----------------------------------------
        # Resultado final
        # ----------------------------------------

        resultado = {

            "sucesso":
                True,

            "arquivo":
                os.path.basename(
                    arquivo
                ),

            "setor":
                setor,

            "linhas":
                len(dados),

            "colunas":
                len(dados.columns),

            "nome_colunas":
                [
                    str(coluna)
                    for coluna in dados.columns
                ],

            "valores_vazios":
                valores_vazios,

            "duplicados":
                duplicados,

            "colunas_numericas":
                [
                    str(coluna)
                    for coluna in colunas_numericas
                ],

            "colunas_texto":
                [
                    str(coluna)
                    for coluna in colunas_texto
                ],

            "estatisticas":
                estatisticas,

            "analise_setor":
                analise_setor,

            "dados":
                dados_dashboard

        }


        return resultado


    except Exception as erro:

        return {

            "sucesso":
                False,

            "erro":
                str(erro)

        }


# ============================================================
# EXECUÇÃO
# ============================================================

if len(sys.argv) < 2:

    resultado = {

        "sucesso":
            False,

        "erro":
            "Nenhum arquivo foi informado"

    } 

else:

    arquivo = sys.argv[1]

    setor = sys.argv[2] \
        if len(sys.argv) > 2 \
        else "personalizado"


    resultado = analisar_arquivo(
            arquivo,
            setor
        )


print(
    json.dumps(
        resultado,
        ensure_ascii=False
    )
)