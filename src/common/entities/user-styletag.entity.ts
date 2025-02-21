import { Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from './base.entity';
import { Styletag } from './styletag.entity';
import { User } from './user.entity';

@Entity('UserStyletag')
export class UserStyletag extends BaseEntity {
  @ManyToOne(() => User, (user) => user.userStyletags)
  @JoinColumn({ name: 'userId' })
  user!: User;

  @ManyToOne(() => Styletag, (styletag) => styletag.userStyletags)
  @JoinColumn({ name: 'styletagId' })
  styletag!: Styletag;
}
