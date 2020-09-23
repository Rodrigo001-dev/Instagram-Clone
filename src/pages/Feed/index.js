// useCallback é um hook que memoriza uma função para ela não ter que ficar 
// sendo recriada toda vez 
import React, { useState, useEffect, useCallback } from 'react';
import { View, FlatList } from 'react-native';

import LazyImage from '../../components/LazyImage';

import { 
  Post, 
  Header, 
  Avatar, 
  Name, 
  Description, 
  Loading 
} from './styles';

const Feed = () => {
  const [feed, setFeed] = useState([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [viewable, setViewable] = useState([]);

  async function loadPage(pageNumber = page, shouldRefresh = false) {
    // Se a variavel total tem alguma informção dentro 
    // dela que seja diferente de 0, se tiver vou verificar se o número
    // da página que eu estou tentando carregar for maior que o número 
    // total de páginas eu vou retornar, eu não vou deixar acontecer nada
    if (total && pageNumber > total) return;

    setLoading(true);

    const response = await fetch(
      `http://localhost:3000/feed?_expand=author&_limit=5&_page=${pageNumber}`
    );

    const data = await response.json();
    const totalItems = response.headers.get('X-Total-Count');

    // (totalItems / 5) - vai calcular o número total que eu tenho de páginas
    setTotal(Math.floor(totalItems / 5)); // 5 é o número de items que é trazido po página
    setFeed(shouldRefresh ? data : [...feed, ...data]); // Se tiver o shouldRefresh a lista vai ser apenas data se não ela vai ser tudo o que eu tenho no feed e no data
    setPage(pageNumber + 1);
    setLoading(false);
  };

  useEffect(() => {
    loadPage();
  }, []);

  async function refreshList() {
    setRefreshing(true);

    await loadPage(1, true);

    setRefreshing(false);
  };

  // changed são os items que estão agora visiveis que não estavam antes
  const handleViewableChanged = useCallback(({ changed }) => {
    setViewable(changed.map(({ item }) => item.id));
  }, []);

  return (
    <View>
      <FlatList
        data={feed}
        keyExtractor={post => String(post.id)}
        onEndReached={() => loadPage()}
        onEndReachedThreshold={0.1} // quando tiver com o scroll a 10% do final lista ele vai começar a carregar os proximos items
        onRefresh={refreshList}
        refreshing={refreshing} // booelano de quando a lista está fazendo o refresh ou já terminou
        onViewableItemsChanged={handleViewableChanged} // função que é disparada quando os items que estão visiveis mudarem
        viewabilityConfig={{ viewAreaCoveragePercentThreshold: 20 }}
        ListFooterComponent={loading && <Loading />}
        renderItem={({ item }) => (
          <Post>
            <Header>
              <Avatar source={{ uri: item.author.avatar }} />
              <Name>{item.author.name}</Name>
            </Header>

            <LazyImage 
              shouldLoad={viewable.includes(item.id)}
              aspectRatio={item.aspectRatio} 
              smallSource={{ uri: item.small }}
              source={{ uri: item.image }} 
            />

            <Description>
              <Name>{item.author.name}</Name> {item.description}
            </Description>
          </Post>
        )} // o item contem todas as informações do post
      />
    </View>
  );
}

export default Feed;