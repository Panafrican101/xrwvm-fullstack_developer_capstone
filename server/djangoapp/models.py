from django.db import models
from django.core.validators import MaxValueValidator, MinValueValidator


class CarMake(models.Model):
	name = models.CharField(max_length=100)
	description = models.TextField(blank=True)
	country = models.CharField(max_length=100, blank=True)

	def __str__(self):
		return self.name


class CarModel(models.Model):
	class CarType(models.TextChoices):
		SEDAN = 'SEDAN', 'Sedan'
		SUV = 'SUV', 'SUV'
		WAGON = 'WAGON', 'Wagon'

	car_make = models.ForeignKey(CarMake, on_delete=models.CASCADE, related_name='car_models')
	dealer_id = models.IntegerField()
	name = models.CharField(max_length=100)
	type = models.CharField(max_length=10, choices=CarType.choices)
	year = models.IntegerField(validators=[MinValueValidator(2015), MaxValueValidator(2023)])
	description = models.TextField(blank=True)

	def __str__(self):
		return f'{self.car_make.name} {self.name}'
