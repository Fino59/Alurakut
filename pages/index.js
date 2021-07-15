import React from 'react';
import MainGrid from '../src/components/MainGrid';
import Box from '../src/components/Box';
import { AlurakutMenu, AlurakutProfileSidebarMenuDefault, OrkutNostalgicIconSet } from '../src/lib/AlurakutCommons';
import { ProfileRelationsBoxWrapper } from '../src/components/ProfileRelations';
import { orkutDocs, trustCoolSexyCounter } from '../src/lib/database/database';

function ProfileSideBar(props) { 
    
  return (
    <Box>
      <img src={`https://github.com/${props.githubUser}.png`} style={{ borderRadius: '8px' }} />
      <hr/>

      <p>
        <a className="boxLink" href={`https://github.com/${props.githubUser}`}>
          @{props.githubUser}
        </a>
      </p>

      <hr />

      <AlurakutProfileSidebarMenuDefault />
    </Box>
  )
};

function ProfileRelationsBox(props) {
  return (
    <ProfileRelationsBoxWrapper>
      <h2 className="smallTitle">
        {props.title} ({props.items.length})
      </h2>
      <ul>
      {props.items.slice(0,6).map((itemAtual) => {
          return (
            <li key={itemAtual.id}>
              <a href={itemAtual.html_url} target="_blank" rel="noopener noreferrer">
                <img src={itemAtual.avatar_url} />
                <span>{itemAtual.login}</span>
              </a>
            </li>
          ); 
        })}
      </ul>
      </ProfileRelationsBoxWrapper>
  );
}

export default function Home() {
  const githubUser = 'Fino59';
  const [communities, setCommunity] = React.useState([]);
  console.log([setCommunity])
  const [following, setFollowing] = React.useState([]);
  const [followers, setFollowers] = React.useState([]);
  React.useEffect(function() {
    fetch('https://api.github.com/users/Fino59/followers')
    .then(function (serverAnswer) {
      return serverAnswer.json();
    })
    .then(function(completeAnswer) {
      setFollowers(completeAnswer);
    })
    fetch('https://api.github.com/users/Fino59/following')
    .then(function (serverAnswer) {
      return serverAnswer.json();
    })
    .then(function(completeAnswer) {
      setFollowing(completeAnswer);
    })
    fetch('https://graphql.datocms.com/', {
      method: 'POST',
      headers: {
        'Authorization': 'f3109eb8354d47effc7d9795c660a5',
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      }, 
      body: JSON.stringify({ "query": `query {
        allCommunities {
          title
          id
          imageUrl
          creatorSlug
        }
      }` })
    })
    .then(response => response.json())
    .then((completeAnswer) => {
      const communitiesCameFromDato = completeAnswer.data.allCommunities;
      setCommunity(communitiesCameFromDato)
    })
  }, [])  
 

  return (
    <>
      <AlurakutMenu />  

      <MainGrid>
        <div className="profileArea" style={{ gridArea: 'profileArea' }}>
          <ProfileSideBar githubUser={githubUser} />
        </div>

        <div className="welcomeArea" style={{ gridArea: 'welcomeArea' }}>
          <Box>
            <h1 className="title">
              Bem vindo(a) {githubUser}
            </h1>

            <OrkutNostalgicIconSet orkutDocs={orkutDocs} trustCoolSexyCounter={trustCoolSexyCounter} />

          </Box>

          <Box>
            
            <h2 className="subTitle">O que você deseja fazer?</h2>

            <form onSubmit={function handleCreateCommunity(e) {
              e.preventDefault();
              const dataFromform = new FormData(e.target);


              const community = {
                id: new Date().toISOString,
                title: dataFromform.get('title'),
                image: dataFromform.get('image'),
              }
              const communityUpdated = [...communities, community ];
              setCommunity (communityUpdated); 

            }}>
              <div>
                <input 
                  placeholder="Qual vai ser o nome da sua comunidade?" 
                  name="title" 
                  aria-label="Qual vai ser o nome da sua comunidade?"
                  type="text" 
                />
              </div>
              <div>
                <input 
                  placeholder="Coloque uma URL para usarmos de capa" 
                  name="image" 
                  aria-label="Coloque uma URL para usarmos de capa" 
                />
              </div>

              <button>
                Criar comunidade
              </button>
            </form>

          </Box>

        </div>
        
        <div className="profileRelationsArea" style={{ gridArea: 'profileRelationsArea' }}>
          
          <ProfileRelationsBox title="Seguidores" items={followers} />

          <ProfileRelationsBox title="Seguindo" items={following} />

          <ProfileRelationsBoxWrapper>
            <h2 className="smallTitle">
              Comunidades ({ communities.length })
            </h2>
              <ul>
                  {communities.map((itemAtual) => {
                    return (
                      <li key={itemAtual.id}>
                        <a href={`/users/${itemAtual.title}`} >
                          <img src={itemAtual.imageUrl} />
                          <span>{itemAtual.title}</span>
                        </a>
                      </li>
                    )
                  })}
              </ul>
          </ProfileRelationsBoxWrapper> 
          
          
        </div>        

      </MainGrid>
    </>
  )
}
