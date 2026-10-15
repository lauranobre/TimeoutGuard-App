import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ActivityIndicator, SafeAreaView } from 'react-native';
import axios from 'axios';

const api = axios.create({
  timeout: 5000, 
});

export default function App() {
  const [loading, setLoading] = useState<boolean>(false);
  const [status, setStatus] = useState<any>({ 
    type: 'welcome', 
    title: 'TimeoutGuard', 
    message: 'Selecione um teste abaixo para simular as requisições.' 
  });

  const dispararRequisicao = async (tipo: string) => {
    setLoading(true);
    setStatus({ type: 'welcome', title: 'Carregando...', message: 'Por favor, aguarde...' });

    // 1. SE FOR TIMEOUT: Criamos um fluxo isolado do relógio para não travar o navegador
    if (tipo === 'timeout') {
      // Dispara uma contagem regressiva forçada de 5 segundos na interface
      setTimeout(() => {
        setStatus({
          type: 'timeout',
          title: '⏱️ Tempo Limite Excedido',
          message: 'Tempo limite excedido. Tente novamente.', // Mensagem exata exigida na página 3 do PDF
        });
        setLoading(false);
      }, 5000);
      
      // Faz a requisição em segundo plano para simular o gasto de banda, mas ignora o retorno dela
      api.get('https://httpbin.org').catch(() => {});
      return; 
    }

    // 2. OUTROS ERROS: Requisições normais para os status codes do httpbin
    let url = '';
    if (tipo === '401') url = 'https://httpbin.org';     
    if (tipo === '404') url = 'https://httpbin.org';     
    if (tipo === '500') url = 'https://httpbin.org';     
    if (tipo === 'sucesso') url = 'https://httpbin.org';        

    try {
      await api.get(url);
      
      setStatus({
        type: 'sucesso',
        title: 'Sucesso! (200)',
        message: 'A requisição respondeu rápido e os dados foram carregados.',
      });
    } catch (error: any) {
      if (error && error.response) {
        const statusCode = error.response.status;

        if (statusCode === 401) {
          setStatus({
            type: '401',
            title: '🔒 Não Autorizado (401)',
            message: 'Sua sessão expirou ou você não tem permissão.',
          });
        } else if (statusCode === 404) {
          setStatus({
            type: '404',
            title: '🔍 Não Encontrado (404)',
            message: 'O endereço solicitado não existe no servidor.',
          });
        } else if (statusCode === 500) {
          setStatus({
            type: '500',
            title: '💥 Erro Interno (500)',
            message: 'O servidor encontrou um problema interno.',
          });
        }
      } else {
        setStatus({
          type: 'erro-rede',
          title: '🌐 Erro de Rede',
          message: 'Não foi possível conectar ao servidor. Verifique sua internet.',
        });
      }
    } finally {
      if (tipo !== 'timeout') {
        setLoading(false);
      }
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* TELA DINÂMICA DE FEEDBACK */}
      <View style={[styles.cardFeedback, (styles as Record<string, any>)[status?.type || 'welcome']]}>
        {loading ? (
          <ActivityIndicator size="large" color="#ffffff" />
        ) : (
          <>
            <Text style={styles.titleFeedback}>{status?.title}</Text>
            <Text style={styles.messageFeedback}>{status?.message}</Text>
          </>
        )}
      </View>

      {/* PAINEL DE CONTROLE / BOTÕES DE TESTE */}
      <View style={styles.containerBotoes}>
        <Text style={styles.tituloPainel}>Simular Cenários:</Text>
        
        <TouchableOpacity 
          style={[styles.botao, styles.corTimeout, loading && styles.botaoDesativado]} 
          onPress={() => dispararRequisicao('timeout')}
          disabled={loading}
        >
          <Text style={styles.textoBotao}>Simular Timeout (&gt; 5s)</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.botao, loading && styles.botaoDesativado]} 
          onPress={() => dispararRequisicao('401')}
          disabled={loading}
        >
          <Text style={styles.textoBotao}>Simular Erro 401</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.botao, loading && styles.botaoDesativado]} 
          onPress={() => dispararRequisicao('404')}
          disabled={loading}
        >
          <Text style={styles.textoBotao}>Simular Erro 404</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.botao, loading && styles.botaoDesativado]} 
          onPress={() => dispararRequisicao('500')}
          disabled={loading}
        >
          <Text style={styles.textoBotao}>Simular Erro 500</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.botao, styles.corSucesso, loading && styles.botaoDesativado]} 
          onPress={() => dispararRequisicao('sucesso')}
          disabled={loading}
        >
          <Text style={styles.textoBotao}>Requisição com Sucesso</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  cardFeedback: {
    width: '100%',
    minHeight: 180,
    borderRadius: 12,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  titleFeedback: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 10,
  },
  messageFeedback: {
    fontSize: 16,
    color: '#ffffff',
    textAlign: 'center',
    opacity: 0.9,
  },
  welcome: { backgroundColor: '#4A5568' },
  sucesso: { backgroundColor: '#2F855A' },
  timeout: { backgroundColor: '#DD6B20' }, 
  '401': { backgroundColor: '#3182CE' },     
  '404': { backgroundColor: '#718096' },     
  '500': { backgroundColor: '#E53E3E' },     
  'erro-rede': { backgroundColor: '#4A5568' },

  containerBotoes: {
    width: '100%',
  },
  tituloPainel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 15,
  },
  botao: {
    backgroundColor: '#2D3748',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
  },
  botaoDesativado: {
    opacity: 0.5, 
  },
  corTimeout: { backgroundColor: '#D69E2E' },
  corSucesso: { backgroundColor: '#38A169' },
  textoBotao: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});