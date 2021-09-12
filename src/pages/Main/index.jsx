import { FaGithub, FaPlus } from 'react-icons/fa';
import { Container, Form, SubmitButton } from './styles';

export default function Main() {
  return (
    <Container>
      <h1>
        <FaGithub size={25} />
        My repositories
      </h1>

      <Form>
        <input onSubmit={() => {}} type="text" placeholder="Add repositories" />
        <SubmitButton>
          <FaPlus color="#FFF" size={14} />
        </SubmitButton>
      </Form>
    </Container>
  );
}
