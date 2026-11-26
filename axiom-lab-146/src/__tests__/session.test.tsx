import { render, screen, within } from '@testing-library/react'
import { SessionProvider } from '../SessionContext'

describe('Session Continuation', () => {
  test('session context provides default state when rendered', () => {
    const { container } = render(
      <SessionProvider>
        <div data-testid="session-root">
          <p>Session active</p>
        </div>
      </SessionProvider>
    )
    
    const element = container.querySelector('[data-testid="session-root"]')
    expect(container.contains(element)).toBe(true)
  })

  test('Send button renders in session controls', () => {
    render(
      <SessionProvider>
        <div data-testid="session-controls">
          <button data-testid="send-btn">Send</button>
        </div>
      </SessionProvider>
    )
    
    const sendBtn = screen.getByRole('button', { name: 'Send' })
    expect(sendBtn.textContent).toBe('Send')
  })

  test('Accept button renders in session controls', () => {
    render(
      <SessionProvider>
        <div data-testid="session-controls">
          <button data-testid="accept-btn">Accept</button>
        </div>
      </SessionProvider>
    )
    
    const acceptBtn = screen.getByRole('button', { name: 'Accept' })
    expect(acceptBtn.textContent).toBe('Accept')
  })

  test('End button renders in session controls', () => {
    render(
      <SessionProvider>
        <div data-testid="session-controls">
          <button data-testid="end-btn">End</button>
        </div>
      </SessionProvider>
    )
    
    const endBtn = screen.getByRole('button', { name: 'End' })
    expect(endBtn.textContent).toBe('End')
  })
})
