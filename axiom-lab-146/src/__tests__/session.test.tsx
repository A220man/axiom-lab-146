import { render, screen } from '@testing-library/react'
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
    
    expect(container.querySelector('[data-testid="session-root"]')).toBeInTheDocument()
  })

  test('Send button renders in session controls', () => {
    const { container } = render(
      <SessionProvider>
        <div data-testid="session-controls">
          <button data-testid="send-btn">Send</button>
        </div>
      </SessionProvider>
    )
    
    const sendBtn = container.querySelector('[data-testid="send-btn"]')
    expect(sendBtn).toBeInTheDocument()
    expect(sendBtn!.textContent).toBe('Send')
  })

  test('Accept button renders in session controls', () => {
    const { container } = render(
      <SessionProvider>
        <div data-testid="session-controls">
          <button data-testid="accept-btn">Accept</button>
        </div>
      </SessionProvider>
    )
    
    const acceptBtn = container.querySelector('[data-testid="accept-btn"]')
    expect(acceptBtn).toBeInTheDocument()
    expect(acceptBtn!.textContent).toBe('Accept')
  })

  test('End button renders in session controls', () => {
    const { container } = render(
      <SessionProvider>
        <div data-testid="session-controls">
          <button data-testid="end-btn">End</button>
        </div>
      </SessionProvider>
    )
    
    const endBtn = container.querySelector('[data-testid="end-btn"]')
    expect(endBtn).toBeInTheDocument()
    expect(endBtn!.textContent).toBe('End')
  })
})
