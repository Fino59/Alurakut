import React from 'react';
import nookies from 'nookies';
import jwt from 'jsonwebtoken';
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

export default function Home(props) {
  const githubUser = props.githubUser;
  const [communities, setCommunity] = React.useState([]);  
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
                title: dataFromform.get('title'),
                imageUrl: dataFromform.get('image'),
                creatorSlug: githubUser,
              }

              fetch('/api/community', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',                  
                },
                body: JSON.stringify(community)
              })
              .then(async (response) => {
                const data = await response.json();
                console.log(data.createRegister); 
                const community = data.createRegister;
                const communityUpdated = [...communities, community ];
                setCommunity(communityUpdated); 
              })


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
                        <a href={`/communities/${itemAtual.id}`} >
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


export async function getServerSideProps(context) {
  const cookies = nookies.get(context);
  const token = cookies.USER_TOKEN;
  
  const { isAuthenticated } = await fetch('https://alurakut.vercel.app/api/auth', {
    headers: {
      Authorization: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJnaXRodWJVc2VyIjoiRmlubzU5Iiwicm9sZXMiOlsidXNlciJdLCJpYXQiOjE2MjY0NzEyNzgsImV4cCI6MTYyNzA3NjA3OH0.TsZ2xJwpxjB2Jfr-XLft6ZdYP5GPMt3CwVIEB73wHHU'
    }
  })
  .then((response) => response.json())
  
  console.log('isAuthenticated', isAuthenticated);

  if(!isAuthenticated) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
    }
  }    
}
  
  const { githubUser } = jwt.decode(token);
  return {
    props: {
      githubUser
    },
  }
}