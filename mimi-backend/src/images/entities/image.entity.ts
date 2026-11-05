import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Image {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column({ type: 'varchar' })
    url!: string;

    @Column({ type: 'int', nullable: true })
    width!: number;

    @Column({ type: 'int', nullable: true })
    height!: number;

    @CreateDateColumn({ type: 'timestamp' })
    createdAt!: Date;
}
