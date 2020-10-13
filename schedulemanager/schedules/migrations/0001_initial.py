from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion
import django_db_constraints.operations


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Day',
            fields=[
                ('day_id', models.AutoField(primary_key=True, serialize=False)),
                ('day_date', models.DateField(blank=True)),
                ('day_str', models.CharField(blank=True, max_length=30)),
            ],
        ),
        migrations.CreateModel(
            name='EventDefinition',
            fields=[
                ('event_id', models.AutoField(primary_key=True, serialize=False)),
                ('event_name', models.CharField(max_length=50)),
                ('priority', models.SmallIntegerField()),
                ('recurring', models.BooleanField()),
                ('active_for_generation', models.BooleanField()),
                ('owner', models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE,
                                            related_name='eventdefinitions', to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='Schedule',
            fields=[
                ('schedule_id', models.AutoField(
                    primary_key=True, serialize=False)),
                ('schedule_name', models.CharField(max_length=30)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('owner', models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE,
                                            related_name='schedules', to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='Time',
            fields=[
                ('time_id', models.AutoField(primary_key=True, serialize=False)),
                ('start', models.TimeField()),
                ('end', models.TimeField()),
            ],
        ),
        migrations.CreateModel(
            name='LooseEvent',
            fields=[
                ('eventdefinition_ptr', models.OneToOneField(auto_created=True, on_delete=django.db.models.deletion.CASCADE,
                                                             parent_link=True, primary_key=True, serialize=False, to='schedules.eventdefinition')),
                ('e_oa_1', models.BooleanField()),
                ('e_oa_2', models.BooleanField()),
                ('nn_n_1', models.BooleanField()),
                ('nn_n_2', models.BooleanField()),
                ('nn_n_3', models.BooleanField()),
                ('nn_n_4', models.BooleanField()),
                ('n_occ', models.SmallIntegerField()),
                ('n_occ_more', models.SmallIntegerField()),
                ('n_occ_less', models.SmallIntegerField()),
                ('occ_same_day', models.BooleanField()),
                ('n_time', models.TimeField()),
                ('n_time_more', models.TimeField()),
                ('n_time_less', models.TimeField()),
            ],
            bases=('schedules.eventdefinition',),
        ),
        migrations.CreateModel(
            name='StrictEvent',
            fields=[
                ('eventdefinition_ptr', models.OneToOneField(auto_created=True, on_delete=django.db.models.deletion.CASCADE,
                                                             parent_link=True, primary_key=True, serialize=False, to='schedules.eventdefinition')),
            ],
            bases=('schedules.eventdefinition',),
        ),
        migrations.CreateModel(
            name='views',
            fields=[
                ('id', models.AutoField(auto_created=True,
                                        primary_key=True, serialize=False, verbose_name='ID')),
                ('schedule', models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE,
                                               related_name='views', to='schedules.schedule')),
                ('viewer', models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE,
                                             related_name='views', to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='TimeDelta',
            fields=[
                ('td_id', models.AutoField(primary_key=True, serialize=False)),
                ('date_time', models.DateTimeField()),
                ('start_end', models.BooleanField()),
                ('rating', models.SmallIntegerField(blank=True)),
                ('event', models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE,
                                            related_name='time_deltas', to='schedules.eventdefinition')),
                ('schedule', models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE,
                                               related_name='time_deltas', to='schedules.schedule')),
            ],
        ),
        migrations.CreateModel(
            name='occurs_on_2',
            fields=[
                ('id', models.AutoField(auto_created=True,
                                        primary_key=True, serialize=False, verbose_name='ID')),
                ('day', models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE,
                                          related_name='occurs_on_2s', to='schedules.day')),
                ('event', models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE,
                                            related_name='occurs_on_2s', to='schedules.looseevent')),
            ],
        ),
        migrations.CreateModel(
            name='occurs_on_1',
            fields=[
                ('id', models.AutoField(auto_created=True,
                                        primary_key=True, serialize=False, verbose_name='ID')),
                ('day', models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE,
                                          related_name='occurs_on_1s', to='schedules.day')),
                ('time', models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE,
                                           related_name='occurs_on_1s', to='schedules.time')),
                ('event', models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE,
                                            related_name='occurs_on_1s', to='schedules.strictevent')),
            ],
        ),
        django_db_constraints.operations.AlterConstraints(
            name='Day',
            db_constraints={
                'CHK_DayNotNull': 'CHECK (day_date IS NOT NULL OR day_str IS NOT NULL)'},
        ),
        django_db_constraints.operations.AlterConstraints(
            name='TimeDelta',
            db_constraints={
                'CHK_Rating': 'CHECK (rating <= 10 AND rating >= 1)'},
        ),
    ]
