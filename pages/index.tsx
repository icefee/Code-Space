import PageBase, { PageProps } from '@components/PageBase'

class Index extends PageBase {
  protected childRender(props: PageProps) {
    return (
      <ul>
        <li>
          Hello world.
        </li>
      </ul>
    )
  }
}

export default Index;
