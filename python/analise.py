import pandas as pd
import sys
import json
import os
import math


def converter_valor(valor):

    # Converte valores do Pandas/Numpy
    # para tipos que o JSON consegue entender.

    if pd.isna(valor):
        return None

    if isinstance(valor, (int, float)):

        if isinstance(valor, float) and (
            math.isnan(valor) or math.isinf(valor)
        ):
            return None

        return float(valor)

    return str(valor)


def analisar_arquivo(arquivo):

    # ==========================================
    # VERIFICA SE O ARQUIVO EXISTE
    # ==========================================

    if not os.path.exists(arquivo):

        return {
            "sucesso": False,
            "erro": "Arquivo não encontrado"
        }


    try:

        # ==========================================
        # IDENTIFICA A EXTENSÃO
        # ==========================================

        extensao = os.path.splitext(
            arquivo
        )[1].lower()


        # ==========================================
        # LÊ O ARQUIVO
        # ==========================================

        if extensao == ".xlsx":

            dados = pd.read_excel(arquivo)

        elif extensao == ".csv":

            dados = pd.read_csv(arquivo)

        elif extensao == ".xls":

            dados = pd.read_excel(arquivo)

        else:

            return {
                "sucesso": False,
                "erro": "Formato de arquivo não suportado"
            }


        # ==========================================
        # INFORMAÇÕES GERAIS
        # ==========================================

        valores_vazios = int(
            dados.isnull().sum().sum()
        )

        duplicados = int(
            dados.duplicated().sum()
        )


        # ==========================================
        # COLUNAS NUMÉRICAS
        # ==========================================

        colunas_numericas = dados.select_dtypes(
            include="number"
        ).columns.tolist()


        # ==========================================
        # COLUNAS DE TEXTO
        # ==========================================

        colunas_texto = dados.select_dtypes(
            include="object"
        ).columns.tolist()


        # ==========================================
        # ESTATÍSTICAS
        # ==========================================

        estatisticas = {}


        for coluna in colunas_numericas:

            serie = dados[coluna].dropna()


            # Evita problemas com coluna vazia

            if len(serie) == 0:

                estatisticas[coluna] = {

                    "soma": None,
                    "media": None,
                    "minimo": None,
                    "maximo": None,
                    "mediana": None

                }

                continue


            estatisticas[coluna] = {

                "soma": round(
                    float(serie.sum()),
                    2
                ),

                "media": round(
                    float(serie.mean()),
                    2
                ),

                "minimo": round(
                    float(serie.min()),
                    2
                ),

                "maximo": round(
                    float(serie.max()),
                    2
                ),

                "mediana": round(
                    float(serie.median()),
                    2
                )

            }


        # ==========================================
        # DADOS DA PLANILHA
        # ==========================================

        dados_planilha = []


        for _, linha in dados.iterrows():

            registro = {}


            for coluna in dados.columns:

                registro[str(coluna)] = converter_valor(
                    linha[coluna]
                )


            dados_planilha.append(registro)


        # ==========================================
        # LIMITA A QUANTIDADE DE DADOS ENVIADOS
        # ==========================================
        #
        # Isso evita que uma planilha muito grande
        # deixe o Dashboard pesado.
        #
        # Por enquanto enviamos no máximo 500 linhas.
        #

        dados_dashboard = dados_planilha[:500]


        # ==========================================
        # RESULTADO FINAL
        # ==========================================

        resultado = {

            "sucesso": True,

            "arquivo":
                os.path.basename(arquivo),

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

            "dados":
                dados_dashboard

        }


        return resultado


    except Exception as erro:

        return {

            "sucesso": False,

            "erro": str(erro)

        }


# ==========================================
# EXECUÇÃO
# ==========================================

if len(sys.argv) < 2:

    resultado = {

        "sucesso": False,

        "erro":
            "Nenhum arquivo foi informado"

    }

else:

    arquivo = sys.argv[1]

    resultado = analisar_arquivo(
        arquivo
    )


# ==========================================
# RETORNA JSON
# ==========================================

print(
    json.dumps(
        resultado,
        ensure_ascii=False
    )
)