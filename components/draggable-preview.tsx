import { useRef, useEffect } from 'react'

interface DraggablePreviewProps {
  children: React.ReactNode
  onReorder: (draggedIndex: number, dropIndex: number) => void
}

export function DraggablePreview({ children, onReorder }: DraggablePreviewProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current) return

    const container = containerRef.current
    const childElements = Array.from(container.children)

    // Make each child draggable
    childElements.forEach((child, index) => {
      if (!(child instanceof HTMLElement)) return

      child.draggable = true
      child.dataset.index = index.toString()
      child.style.cursor = 'move'

      child.addEventListener('dragstart', (e) => {
        e.stopPropagation()
        if (e.dataTransfer) {
          child.style.opacity = '0.5'
          e.dataTransfer.setData('text/plain', index.toString())
          e.dataTransfer.effectAllowed = 'move'
        }
      })

      child.addEventListener('dragend', () => {
        child.style.opacity = ''
      })

      child.addEventListener('dragover', (e) => {
        e.preventDefault()
        e.stopPropagation()
        e.dataTransfer!.dropEffect = 'move'
      })

      child.addEventListener('drop', (e) => {
        e.preventDefault()
        e.stopPropagation()
        const draggedIndex = parseInt(e.dataTransfer!.getData('text/plain'))
        const dropIndex = index
        if (draggedIndex !== dropIndex) {
          onReorder(draggedIndex, dropIndex)
        }
      })

      // Add drop zones between elements
      if (index < childElements.length) {
        const dropZone = document.createElement('div')
        dropZone.className = 'h-2 w-full my-1 rounded bg-transparent hover:bg-primary/10 transition-colors'
        dropZone.dataset.dropIndex = index.toString()

        dropZone.addEventListener('dragover', (e) => {
          e.preventDefault()
          e.stopPropagation()
          dropZone.classList.add('bg-primary/10')
          e.dataTransfer!.dropEffect = 'move'
        })

        dropZone.addEventListener('dragleave', () => {
          dropZone.classList.remove('bg-primary/10')
        })

        dropZone.addEventListener('drop', (e) => {
          e.preventDefault()
          e.stopPropagation()
          dropZone.classList.remove('bg-primary/10')
          const draggedIndex = parseInt(e.dataTransfer!.getData('text/plain'))
          const dropIndex = parseInt(dropZone.dataset.dropIndex!)
          if (draggedIndex !== dropIndex) {
            onReorder(draggedIndex, dropIndex)
          }
        })

        child.parentNode?.insertBefore(dropZone, child)
      }
    })

    // Add a final drop zone
    if (childElements.length > 0) {
      const lastDropZone = document.createElement('div')
      lastDropZone.className = 'h-2 w-full my-1 rounded bg-transparent hover:bg-primary/10 transition-colors'
      lastDropZone.dataset.dropIndex = childElements.length.toString()

      lastDropZone.addEventListener('dragover', (e) => {
        e.preventDefault()
        e.stopPropagation()
        lastDropZone.classList.add('bg-primary/10')
        e.dataTransfer!.dropEffect = 'move'
      })

      lastDropZone.addEventListener('dragleave', () => {
        lastDropZone.classList.remove('bg-primary/10')
      })

      lastDropZone.addEventListener('drop', (e) => {
        e.preventDefault()
        e.stopPropagation()
        lastDropZone.classList.remove('bg-primary/10')
        const draggedIndex = parseInt(e.dataTransfer!.getData('text/plain'))
        const dropIndex = parseInt(lastDropZone.dataset.dropIndex!)
        if (draggedIndex !== dropIndex) {
          onReorder(draggedIndex, dropIndex)
        }
      })

      container.appendChild(lastDropZone)
    }

    return () => {
      // Cleanup will happen automatically when the elements are removed
    }
  }, [onReorder, children])

  return (
    <div ref={containerRef} className="space-y-4">
      {children}
    </div>
  )
}
