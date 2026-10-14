import '../src/index';
import { verifyTagRegistrations } from '../../../tests/custom-element-registration';

verifyTagRegistrations(["skyra-popover"], () => import('../src/index'));
