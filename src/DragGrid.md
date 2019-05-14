/\*\*

- <DragContent
- onChange={({ sourceId, sourceIndex, targetId, targetIndex }) => {
-       // mutate and update state
- }}
- >
-
- <Dropzone id='drop1' items={items}>
- {(item, i, isDragging, isAnimatingToPlaceholder) => {
-       <MyComponent>Hello</MyComponent>
- }}
- </Dropzone>
-
-
- <Dropzone id='drop2' items={items2} disabled>
- {(item, i, isDragging) => {
-      <MyComponent>Hello</MyComponent>
- }}
- </Dropzone>
-
- </DagContent>
-
- Our Dropzone renders each item using a Draggable element.
- It only handles animating placement and using gesture-responder.
  \*/
