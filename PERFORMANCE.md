# Otimizações de Performance do LinkHub

Este documento descreve as otimizações de performance implementadas no projeto LinkHub e como utilizá-las.

## Análise de Bundle

Para analisar o tamanho do bundle da aplicação, você pode usar o comando:

\`\`\`bash
npm run analyze
\`\`\`

Isso irá gerar um relatório visual do tamanho de cada pacote no bundle, ajudando a identificar pacotes grandes que podem ser otimizados.

## Otimizações Implementadas

### 1. Carregamento de Imagens Otimizado

Utilizamos o componente `OptimizedImage` para:
- Carregar imagens apenas quando estiverem próximas de entrar na viewport
- Mostrar um placeholder enquanto a imagem carrega
- Utilizar o formato de imagem mais eficiente disponível

Exemplo de uso:

\`\`\`jsx
import { OptimizedImage } from '@/components/optimized-image'

<OptimizedImage 
  src="/example.jpg" 
  alt="Exemplo" 
  width={800} 
  height={600} 
  priority={false} 
/>
\`\`\`

### 2. Lazy Loading de Componentes

O componente `LazyComponent` permite carregar componentes pesados apenas quando necessário:

\`\`\`jsx
import { LazyComponent } from '@/components/lazy-component'
import { Skeleton } from '@/components/ui/skeleton'

<LazyComponent 
  component={() => import('@/components/heavy-component')}
  fallback={<Skeleton className="h-40 w-full" />}
  props={{ someData: data }}
/>
\`\`\`

### 3. Otimização de Fontes

As fontes são carregadas de forma otimizada usando o sistema de fontes do Next.js, com:
- Precarregamento
- Estratégia de swap para evitar texto invisível
- Subconjuntos específicos para reduzir o tamanho

### 4. Carregamento Otimizado de Scripts de Terceiros

O componente `ThirdPartyScript` carrega scripts externos apenas após a interação do usuário:

\`\`\`jsx
import { ThirdPartyScript } from '@/components/third-party-script'

<ThirdPartyScript 
  src="https://example.com/script.js" 
  id="example-script" 
  strategy="lazyOnload" 
/>
\`\`\`

## Monitoramento de Performance

Utilizamos o Lighthouse CI para monitorar continuamente a performance da aplicação. Os relatórios são gerados automaticamente para cada pull request e push para a branch principal.

## Melhores Práticas

1. **Evite Renderizações Desnecessárias**
   - Use `React.memo` para componentes que não mudam frequentemente
   - Use `useMemo` e `useCallback` para evitar recriação de objetos e funções

2. **Minimize o Tamanho do Bundle**
   - Importe apenas o necessário de cada biblioteca
   - Use análise de bundle para identificar pacotes grandes

3. **Otimize Imagens**
   - Use o componente `OptimizedImage`
   - Comprima imagens antes de adicioná-las ao projeto

4. **Priorize o Conteúdo Crítico**
   - Use `priority={true}` para imagens acima da dobra
   - Use `next/font` para fontes críticas
