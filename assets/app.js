const $ = (selector) => document.querySelector(selector)
const $$ = (selector) => [...document.querySelectorAll(selector)]

const initialState = () => ({
  seconds: 480,
  tick: 0,
  availability: 99.99,
  latency: 82,
  errors: 0.08,
  cost: 186,
  traffic: 1200,
  replicas: 3,
  credits: 4,
  score: 82,
  reliability: 90,
  automation: 25,
  performance: 86,
  efficiency: 92,
  version: 'v1.4.1',
  stableVersion: 'v1.4.1',
  deployedBadVersion: false,
  incidentsResolved: 0,
  incidentId: 0,
  activeIncidents: [],
  upgrades: {
    autoscaling: false,
    healthchecks: false,
    canary: false,
    dbpool: false
  },
  ended: false
})

let state = initialState()
let timerHandle = null
let toastHandle = null

const incidentDefinitions = {
  traffic: {
    title: 'Traffic spike detected',
    severity: 'warn',
    description: 'Request volume surged above normal operating capacity.'
  },
  pod: {
    title: 'API pod unhealthy',
    severity: 'critical',
    description: 'A memory leak is causing one replica to fail health checks.'
  },
  release: {
    title: 'Release regression',
    severity: 'critical',
    description: 'v1.4.2 is producing elevated HTTP 500 responses.'
  },
  database: {
    title: 'Database saturation',
    severity: 'warn',
    description: 'Connection pressure is causing slow query execution.'
  }
}

const formatTraffic = (value) => value >= 1000 ? `${(value / 1000).toFixed(1)}k rpm` : `${Math.round(value)} rpm`
const clamp = (value, min, max) => Math.min(max, Math.max(min, value))

function notify(message) {
  const toast = $('#toast')
  toast.textContent = message
  toast.classList.add('show')
  clearTimeout(toastHandle)
  toastHandle = setTimeout(() => toast.classList.remove('show'), 1800)
}

function hasIncident(type) {
  return state.activeIncidents.some((incident) => incident.type === type && !incident.resolved)
}

function addIncident(type) {
  if (hasIncident(type) || state.ended) return
  const definition = incidentDefinitions[type]
  state.incidentId += 1
  state.activeIncidents.unshift({
    id: state.incidentId,
    type,
    title: definition.title,
    severity: definition.severity,
    description: definition.description,
    resolved: false,
    createdAt: state.tick
  })
  notify(definition.title)
}

function resolveIncident(type, reason) {
  const incident = state.activeIncidents.find((item) => item.type === type && !item.resolved)
  if (!incident) return false
  incident.resolved = true
  incident.description = reason
  state.incidentsResolved += 1
  state.credits = clamp(state.credits + 1, 0, 9)
  notify(`${incident.title} resolved`)
  return true
}

function triggerScheduledEvents() {
  if (state.tick === 20) addIncident('traffic')
  if (state.tick === 75) addIncident('pod')
  if (state.tick === 135) addIncident('database')
  if (state.tick === 205 && !state.deployedBadVersion) addIncident('traffic')
  if (state.tick === 300) addIncident('pod')
  if (state.tick === 380) addIncident('database')
}

function applyAutomation() {
  if (hasIncident('traffic') && state.upgrades.autoscaling) {
    const target = clamp(Math.ceil(state.traffic / 850), 3, 8)
    if (state.replicas < target) {
      const delta = target - state.replicas
      state.replicas = target
      state.cost += delta * 28
    }
    if (state.replicas >= target) resolveIncident('traffic', 'HPA increased capacity and stabilized request latency.')
  }

  if (hasIncident('pod') && state.upgrades.healthchecks) {
    resolveIncident('pod', 'Liveness probes replaced the unhealthy replica automatically.')
  }

  if (hasIncident('database') && state.upgrades.dbpool) {
    resolveIncident('database', 'Connection pooling absorbed the spike and normalized database pressure.')
  }

  if (hasIncident('release') && state.upgrades.canary) {
    state.version = state.stableVersion
    state.deployedBadVersion = false
    resolveIncident('release', 'Canary analysis stopped the rollout and restored the stable release.')
  }
}

function simulateMetrics() {
  const trafficSpike = hasIncident('traffic')
  const podFailure = hasIncident('pod')
  const releaseFailure = hasIncident('release')
  const dbFailure = hasIncident('database')

  if (trafficSpike) state.traffic = clamp(state.traffic + 120, 1200, 8600)
  else state.traffic += (1200 - state.traffic) * 0.05

  const capacity = state.replicas * 1150
  const overload = Math.max(0, state.traffic - capacity)
  const overloadRatio = overload / Math.max(capacity, 1)

  let latencyTarget = 75 + overloadRatio * 520
  let errorTarget = 0.08 + overloadRatio * 6

  if (podFailure) {
    latencyTarget += 130
    errorTarget += 1.8
  }
  if (releaseFailure) {
    latencyTarget += 90
    errorTarget += 7.5
  }
  if (dbFailure) {
    latencyTarget += state.upgrades.dbpool ? 30 : 240
    errorTarget += state.upgrades.dbpool ? 0.3 : 2.6
  }

  state.latency += (latencyTarget - state.latency) * 0.18
  state.errors += (errorTarget - state.errors) * 0.16

  const unhealthy = state.errors > 1 || state.latency > 220
  if (unhealthy) state.availability -= clamp(state.errors * 0.00085, 0.0004, 0.025)
  state.availability = clamp(state.availability, 92, 99.999)

  if (!trafficSpike && state.upgrades.autoscaling && state.replicas > 3 && state.tick % 20 === 0) {
    state.replicas -= 1
    state.cost -= 28
  }

  const reliability = clamp(100 - (99.95 - state.availability) * 620 - state.errors * 1.3, 0, 100)
  const performance = clamp(105 - state.latency / 4.2 - state.errors * 2.2, 0, 100)
  const automation = 25 + Object.values(state.upgrades).filter(Boolean).length * 18.75
  const efficiency = clamp(115 - Math.max(0, state.cost - 186) / 4.2, 0, 100)

  state.reliability = reliability
  state.performance = performance
  state.automation = automation
  state.efficiency = efficiency
  state.score = Math.round(reliability * 0.4 + automation * 0.2 + performance * 0.25 + efficiency * 0.15)
}

function renderIncidents() {
  const feed = $('#incident-feed')
  const activeCount = state.activeIncidents.filter((incident) => !incident.resolved).length
  $('#incident-count').textContent = `${activeCount} active`
  $('#incident-count').className = `tag ${activeCount ? 'danger' : ''}`

  if (!state.activeIncidents.length) {
    feed.innerHTML = '<div class="incident resolved"><strong>No incidents</strong><span>Production telemetry is quiet.</span></div>'
    return
  }

  feed.innerHTML = state.activeIncidents.slice(0, 8).map((incident) => `
    <div class="incident ${incident.resolved ? 'resolved' : incident.severity}">
      <strong>${incident.resolved ? 'Resolved · ' : ''}${incident.title}</strong>
      <span>${incident.description}</span>
    </div>
  `).join('')
}

function render() {
  const mins = String(Math.floor(state.seconds / 60)).padStart(2, '0')
  const secs = String(state.seconds % 60).padStart(2, '0')
  $('#timer').textContent = `${mins}:${secs}`
  $('#availability').textContent = `${state.availability.toFixed(3)}%`
  $('#latency').textContent = `${Math.round(state.latency)} ms`
  $('#errors').textContent = `${state.errors.toFixed(2)}%`
  $('#cost').textContent = `€${Math.round(state.cost)}`
  $('#traffic').textContent = formatTraffic(state.traffic)
  $('#replicas').textContent = state.replicas
  $('#credits').textContent = `${state.credits} credits`
  $('#score').textContent = state.score
  $('#score-reliability').value = state.reliability
  $('#score-automation').value = state.automation
  $('#score-performance').value = state.performance
  $('#score-efficiency').value = state.efficiency
  $('#version').textContent = state.version

  const active = state.activeIncidents.filter((incident) => !incident.resolved)
  const statusPill = $('#status-pill')
  const critical = active.some((incident) => incident.severity === 'critical') || state.errors > 4
  const warning = active.length > 0 || state.latency > 220 || state.errors > 1

  statusPill.textContent = critical ? 'PRODUCTION CRITICAL' : warning ? 'PRODUCTION DEGRADED' : 'PRODUCTION HEALTHY'
  statusPill.className = `status-pill ${critical ? 'critical' : warning ? 'warning' : 'healthy'}`

  const apiService = $('#api-service')
  apiService.className = `service primary ${hasIncident('pod') ? 'down' : warning ? 'degraded' : ''}`
  $('#db-state').textContent = hasIncident('database') ? 'saturated' : 'healthy'
  $('#cache-state').textContent = hasIncident('database') ? 'under pressure' : 'healthy'
  $('#alert-state').textContent = active.length ? `${active.length} firing` : 'quiet'

  $$('.upgrade').forEach((button) => {
    const name = button.dataset.upgrade
    const activeUpgrade = state.upgrades[name]
    button.classList.toggle('active', activeUpgrade)
    const cost = Number(button.dataset.cost)
    button.disabled = activeUpgrade || state.credits < cost
    button.querySelector('em').textContent = activeUpgrade ? '✓' : String(cost)
  })

  renderIncidents()
}

function tick() {
  if (state.ended) return
  state.tick += 1
  state.seconds -= 1
  triggerScheduledEvents()
  applyAutomation()
  simulateMetrics()
  render()

  if (state.availability <= 96 || state.seconds <= 0) finishRun()
}

function finishRun() {
  if (state.ended) return
  state.ended = true
  clearInterval(timerHandle)
  const survived = state.seconds <= 0 && state.availability > 96
  $('#result-title').textContent = survived ? 'Production survived.' : 'Production went down.'
  $('#result-copy').textContent = survived
    ? 'Your final score reflects reliability, automation, performance and infrastructure efficiency.'
    : 'Availability fell below the minimum threshold. Improve automation and react earlier to incidents.'
  $('#result-score').textContent = state.score
  $('#result-availability').textContent = `${state.availability.toFixed(3)}%`
  $('#result-incidents').textContent = state.incidentsResolved
  $('#result-modal').classList.remove('hidden')
}

function performAction(action) {
  if (state.ended) return

  if (action === 'scale-up') {
    if (state.replicas >= 8) return notify('Replica limit reached')
    state.replicas += 1
    state.cost += 28
    if (hasIncident('traffic') && state.replicas * 1150 >= state.traffic) resolveIncident('traffic', 'Manual scaling restored enough API capacity for the current load.')
    notify('API scaled up')
  }

  if (action === 'scale-down') {
    if (state.replicas <= 1) return notify('At least one replica is required')
    state.replicas -= 1
    state.cost = Math.max(102, state.cost - 28)
    notify('API scaled down')
  }

  if (action === 'restart') {
    if (!resolveIncident('pod', 'The unhealthy pod was manually restarted and returned to service.')) notify('No unhealthy API pod detected')
  }

  if (action === 'rollback') {
    if (!hasIncident('release')) return notify('No failing release to roll back')
    state.version = state.stableVersion
    state.deployedBadVersion = false
    resolveIncident('release', 'Release rolled back to the last stable version.')
  }

  if (action === 'deploy') {
    if (state.version === 'v1.4.2') return notify('v1.4.2 is already deployed')
    $('#pipeline-deploy').className = 'running'
    $('#pipeline-deploy').textContent = 'Deploying'
    setTimeout(() => {
      if (state.ended) return
      state.version = 'v1.4.2'
      state.deployedBadVersion = true
      $('#pipeline-deploy').className = state.upgrades.canary ? 'failed' : 'done'
      $('#pipeline-deploy').textContent = state.upgrades.canary ? 'Blocked' : 'Deploy'
      addIncident('release')
      applyAutomation()
      render()
    }, 900)
    notify('Release pipeline started')
  }

  if (action === 'cache') {
    if (hasIncident('database')) {
      state.latency = Math.max(95, state.latency - 80)
      state.errors = Math.max(0.15, state.errors - 0.8)
      resolveIncident('database', 'Cache warming reduced database traffic and stabilized query load.')
    } else {
      state.latency = Math.max(65, state.latency - 14)
      notify('Cache warmed')
    }
  }

  render()
}

function buyUpgrade(name, cost) {
  if (state.upgrades[name] || state.credits < cost || state.ended) return
  state.credits -= cost
  state.upgrades[name] = true
  notify(`${name} automation enabled`)
  applyAutomation()
  render()
}

function resetGame() {
  clearInterval(timerHandle)
  state = initialState()
  $('#pipeline-deploy').className = ''
  $('#pipeline-deploy').textContent = 'Deploy'
  $('#result-modal').classList.add('hidden')
  render()
  timerHandle = setInterval(tick, 1000)
}

$$('[data-action]').forEach((button) => button.addEventListener('click', () => performAction(button.dataset.action)))
$$('[data-upgrade]').forEach((button) => button.addEventListener('click', () => buyUpgrade(button.dataset.upgrade, Number(button.dataset.cost))))
$('#reset-btn').addEventListener('click', resetGame)
$('#play-again').addEventListener('click', resetGame)

render()
timerHandle = setInterval(tick, 1000)


const gameWindow = $('#game-window')
const taskbarGame = $('#taskbar-game')
const startButton = $('#start-button')
const startMenu = $('#start-menu')

function setWindowVisible(visible) {
  gameWindow.classList.toggle('is-minimized', !visible)
  gameWindow.classList.remove('is-closed')
  taskbarGame.classList.toggle('is-active', visible)
  taskbarGame.classList.toggle('is-minimized', !visible)
}

function openGameWindow() {
  setWindowVisible(true)
  startMenu.hidden = true
  startButton.setAttribute('aria-expanded', 'false')
}

$$('[data-open-game]').forEach((button) => button.addEventListener('click', openGameWindow))

$$('[data-window-action]').forEach((button) => {
  button.addEventListener('click', () => {
    const action = button.dataset.windowAction

    if (action === 'minimize') {
      setWindowVisible(false)
      return
    }

    if (action === 'maximize') {
      gameWindow.classList.toggle('is-maximized')
      return
    }

    if (action === 'close') {
      gameWindow.classList.add('is-closed')
      taskbarGame.classList.remove('is-active')
      taskbarGame.classList.add('is-minimized')
    }
  })
})

taskbarGame.addEventListener('click', () => {
  const hidden = gameWindow.classList.contains('is-minimized') || gameWindow.classList.contains('is-closed')
  if (hidden) openGameWindow()
  else setWindowVisible(false)
})

startButton.addEventListener('click', () => {
  startMenu.hidden = !startMenu.hidden
  startButton.setAttribute('aria-expanded', String(!startMenu.hidden))
})

$('#start-reset').addEventListener('click', () => {
  resetGame()
  openGameWindow()
})

document.addEventListener('click', (event) => {
  if (startMenu.hidden) return
  if (startMenu.contains(event.target) || startButton.contains(event.target)) return
  startMenu.hidden = true
  startButton.setAttribute('aria-expanded', 'false')
})

function updateDesktopClock() {
  $('#desktop-clock').textContent = new Intl.DateTimeFormat([], {
    hour: '2-digit',
    minute: '2-digit'
  }).format(new Date())
}

updateDesktopClock()
setInterval(updateDesktopClock, 15000)
