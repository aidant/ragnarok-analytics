import { handleImplicitGrantCallback } from '@lazy/oauth2-implicit-grant-client'
import Application from './index.svelte'
import './style.css'

handleImplicitGrantCallback()

addEventListener('load', () => {
  new Application({
    target: document.querySelector('#application')
  })
})
